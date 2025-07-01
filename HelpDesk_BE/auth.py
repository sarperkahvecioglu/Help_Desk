from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from classes.User import User
from classes.Client import Client
from classes.SupportUser import SupportUser
from pydanticModels import TokenData
from Enums import UserTypes
import os
from dotenv import load_dotenv

load_dotenv()

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Bearer token scheme
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:

    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
   
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    return token_data

def get_user_by_email(db: Session, email: str):
    
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    token_data = verify_token(token, credentials_exception)
    user = get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

def get_current_client(current_user: User = Depends(get_current_user)):
    
    if current_user.userType != UserTypes.CLIENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Client Authorization required"
        )
    return current_user

def get_current_support_user(current_user: User = Depends(get_current_user)):
    
    if current_user.userType != UserTypes.SUPPORT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Support Authorization required"
        )
    return current_user

def create_user(db: Session, name: str, email: str, password: str) -> User:

    hashed_password = get_password_hash(password)
    
    # If email includes @support, it is support user; else, it is Client
    if "@support" in email.lower():
        user = SupportUser(
            name=name,
            email=email,
            password=hashed_password,
            userType=UserTypes.SUPPORT
        )
    else:
        user = Client(
            name=name,
            email=email,
            password=hashed_password,
            userType=UserTypes.CLIENT
        )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user 