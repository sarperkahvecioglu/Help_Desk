from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
from classes.User import User
from classes.Request import Request
from classes.ClientRequest import ClientRequest
from pydanticModels import ClientRequestCreate, ClientRequestRead, ClientRequestUpdate
from auth import get_current_client
from typing import List, Optional
from Enums import RequestTypes, RequestStatus, RequestPriorityTypes
from sqlalchemy import desc, asc

router = APIRouter(prefix="/client", tags=["Client"])

@router.post("/request/", response_model=ClientRequestRead)
def create_request(req: ClientRequestCreate,
                    current_user: User = Depends(get_current_client),
                    db: Session = Depends(get_db)):
    
    # Create new request
    request = Request(
        type = req.type,
        request = req.request,
        priority = req.priority,
        status = req.status,
        viewed = req.viewed
    )

    db.add(request)
    db.commit()
    db.refresh(request)

    # Create ClientRequest
    client_request = ClientRequest(
        client_id=current_user.id,
        request_id=request.id
    )

    db.add(client_request)
    db.commit()

    return request

@router.get("/my-requests/", response_model=List[ClientRequestRead])
def get_my_requests(
    current_user: User = Depends(get_current_client),
    db: Session = Depends(get_db),
    # Filtering parameters
    type: Optional[int] = Query(None, description="Filter according to type (0: REVIEW, 1: DEVELOPMENT, 2: DISCUSS)"),
    status: Optional[int] = Query(None, description="Filter according to status (0: PENDING, 1: IN_PROCESS, 2: DONE)"),
    priority: Optional[int] = Query(None, description="Filter according to priority (0: CAN_WAIT, 1: MIDDLE, 2: IMPORTANT)"),
    viewed: Optional[bool] = Query(None, description="Filter according to view status"),

    # Sorting parameters
    sort_by: Optional[str] = Query("created_at", description="Criteria: 'priority' or 'created_at'"),
    sort_order: Optional[str] = Query("desc", description="Ordering direction: 'asc' or 'desc'")
):

    type_enum = None
    status_enum = None
    priority_enum = None
    
    try:
        if type is not None:
            type_enum = RequestTypes(type)
        if status is not None:
            status_enum = RequestStatus(status)
        if priority is not None:
            priority_enum = RequestPriorityTypes(priority)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid value: {str(e)}"
        )
    
    # Find client requests from ClientRequests table
    client_requests = db.query(ClientRequest).filter(
        ClientRequest.client_id == current_user.id
    ).all()
    
    # Fetch request_ids
    request_ids = [cr.request_id for cr in client_requests]
    
    if not request_ids:
        return []
    
    query = db.query(Request).filter(Request.id.in_(request_ids))
    
    # Filtering
    if type_enum is not None:
        query = query.filter(Request.type == type_enum)
    if status_enum is not None:
        query = query.filter(Request.status == status_enum)
    if priority_enum is not None:
        query = query.filter(Request.priority == priority_enum)
    if viewed is not None:
        query = query.filter(Request.viewed == viewed)
    
    # Sorting
    if sort_by == "priority":
        if sort_order == "asc":
            query = query.order_by(asc(Request.priority))
        else:
            query = query.order_by(desc(Request.priority))
    else:  # created_at
        if sort_order == "asc":
            query = query.order_by(asc(Request.created_at))
        else:
            query = query.order_by(desc(Request.created_at))
    
    requests = query.all()
    return requests

@router.get("/request/{request_id}", response_model=ClientRequestRead)
def get_single_request(
    request_id: int,
    current_user: User = Depends(get_current_client),
    db: Session = Depends(get_db)
):

    # Check if specified request is current user's
    client_request = db.query(ClientRequest).filter(
        ClientRequest.client_id == current_user.id,
        ClientRequest.request_id == request_id
    ).first()
    
    if not client_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couldn't find request"
        )
    
    # Fetch request
    request = db.query(Request).filter(Request.id == request_id).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couldn't find request"
        )
    
    return request

@router.put("/request/{request_id}", response_model=ClientRequestRead)
def update_request(
    request_id: int,
    request_update: ClientRequestUpdate,
    current_user: User = Depends(get_current_client),
    db: Session = Depends(get_db)
):

    client_request = db.query(ClientRequest).filter(
        ClientRequest.client_id == current_user.id,
        ClientRequest.request_id == request_id
    ).first()
    
    if not client_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couldn't find request"
        )
    
    request = db.query(Request).filter(Request.id == request_id).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couldn't find request"
        )
    
    update_data = request_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(request, field, value)
    
    db.commit()
    db.refresh(request)
    
    return request

