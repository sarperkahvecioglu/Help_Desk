from pydantic import BaseModel, EmailStr
from Enums import UserTypes, RequestTypes, RequestStatus, RequestPriorityTypes
from datetime import datetime
from typing import Optional


class SupportListUsersResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    userType: UserTypes

    class Config:
        orm_mode = True

class ClientRequestCreate(BaseModel):
    type: RequestTypes
    request: str
    status: RequestStatus = RequestStatus.PENDING
    priority: RequestPriorityTypes
    viewed: bool = False

    class Config:
        orm_mode = True

class ClientRequestRead(BaseModel):
    id: int
    type: RequestTypes
    request: str
    status: RequestStatus
    priority: RequestPriorityTypes
    viewed: bool

    class Config:
        orm_mode = True

class SupportGetAllRequestsResponse(BaseModel):
    id: int
    type: RequestTypes
    request: str
    status: RequestStatus
    priority: RequestPriorityTypes
    viewed: bool
    created_at: datetime

    class Config:
        orm_mode = True

# Authentication Models
class UserSignUp(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    userType: UserTypes

    class Config:
        orm_mode = True

# Request Management Models
class ClientRequestUpdate(BaseModel):
    type: Optional[RequestTypes] = None
    request: Optional[str] = None
    priority: Optional[RequestPriorityTypes] = None

    class Config:
        orm_mode = True

class SupportRequestStatusUpdate(BaseModel):
    status: RequestStatus

    class Config:
        orm_mode = True
    