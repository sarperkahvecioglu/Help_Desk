from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
from classes.User import User
from classes.Request import Request
from pydanticModels import SupportListUsersResponse, SupportGetAllRequestsResponse, SupportRequestStatusUpdate
from auth import get_current_support_user
from typing import List, Optional
from Enums import RequestTypes, RequestStatus, RequestPriorityTypes
from sqlalchemy import desc, asc

router = APIRouter(prefix="/support", tags=["Support"])

@router.get("/clients/", response_model=List[SupportListUsersResponse])
def list_users(current_user: User = Depends(get_current_support_user),
               db: Session = Depends(get_db)):
    # Only return clients, not support users
    from Enums import UserTypes
    return db.query(User).filter(User.userType == UserTypes.CLIENT).all()

@router.get("/requests/", response_model=List[SupportGetAllRequestsResponse])
def get_all_requests(
    current_user: User = Depends(get_current_support_user),
    db: Session = Depends(get_db),
    # Filtering parameters
    type: Optional[int] = Query(None, description="Filter according to type (0: REVIEW, 1: DEVELOPMENT, 2: DISCUSS)"),
    status: Optional[int] = Query(None, description="Filter according to status (0: PENDING, 1: IN_PROCESS, 2: DONE)"),
    priority: Optional[int] = Query(None, description="Filter according to priority (0: CAN_WAIT, 1: MIDDLE, 2: IMPORTANT)"),
    viewed: Optional[bool] = Query(None, description="Filter according to viewed or not"),
    
    # Sorting parameters
    sort_by: Optional[str] = Query("created_at", description="Sorting criteria: 'priority' or 'created_at'"),
    sort_order: Optional[str] = Query("desc", description="Sorting direction: 'asc' or 'desc'")
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
    
    query = db.query(Request)
    
    if type_enum is not None:
        query = query.filter(Request.type == type_enum)
    if status_enum is not None:
        query = query.filter(Request.status == status_enum)
    if priority_enum is not None:
        query = query.filter(Request.priority == priority_enum)
    if viewed is not None:
        query = query.filter(Request.viewed == viewed)
    
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

@router.get("/request/{request_id}", response_model=SupportGetAllRequestsResponse)
def get_single_request(
    request_id: int,
    current_user: User = Depends(get_current_support_user),
    db: Session = Depends(get_db)
):

    request = db.query(Request).filter(Request.id == request_id).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couldn't find request"
        )
    
    # Viewed = true when the request is viewed by support user
    if not request.viewed:
        request.viewed = True
        db.commit()
        db.refresh(request)
    
    return request

@router.put("/request/{request_id}/status", response_model=SupportGetAllRequestsResponse)
def update_request_status(
    request_id: int,
    status_update: SupportRequestStatusUpdate,
    current_user: User = Depends(get_current_support_user),
    db: Session = Depends(get_db)
):

    request = db.query(Request).filter(Request.id == request_id).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Couldn't find request"
        )
    
    request.status = status_update.status
    
    db.commit()
    db.refresh(request)
    
    return request