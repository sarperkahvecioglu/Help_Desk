from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy import Enum as SQLEnum
from Enums import UserTypes

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    userType = Column(SQLEnum(UserTypes), nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": "user",
        "polymorphic_on": userType,
    }

