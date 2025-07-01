from database import Base
from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, text
from sqlalchemy import Enum as SQLEnum
from Enums import RequestTypes, RequestStatus, RequestPriorityTypes


class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    type = Column(SQLEnum(RequestTypes), nullable=False)
    request = Column(String, nullable=False)
    status = Column(SQLEnum(RequestStatus), nullable=False, server_default=text(f"'{RequestStatus.PENDING.name}'"))
    priority = Column(SQLEnum(RequestPriorityTypes), nullable=False)
    viewed = Column(Boolean, nullable=False, server_default=text('false'))
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))