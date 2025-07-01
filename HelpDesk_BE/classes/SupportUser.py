from .User import User
from Enums import UserTypes
from sqlalchemy import Column, Integer, ForeignKey

class SupportUser(User):
    __tablename__ = "support_users"

    id = Column(Integer,
                ForeignKey('users.id'),
                primary_key=True,
                nullable=False,
                autoincrement=True
                )
    
    __mapper_args__ = {
        "polymorphic_identity": UserTypes.SUPPORT
    }



    