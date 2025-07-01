from database import Base
from sqlalchemy import Column, Integer, ForeignKey


class ClientRequest(Base):
    __tablename__ = "client_requests"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    client_id = Column(
        Integer,
        ForeignKey('clients.id', ondelete='CASCADE'),
        nullable=False,
        )
    request_id = Column(
        Integer,
        ForeignKey('requests.id', ondelete='CASCADE'),
        nullable=False,
        autoincrement=True
    )
