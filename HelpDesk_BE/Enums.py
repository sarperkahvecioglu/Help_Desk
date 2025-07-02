from enum import Enum

class UserTypes(Enum):
    CLIENT = 0
    SUPPORT = 1

class RequestTypes(Enum):
    REVIEW = 0
    DEVELOPMENT = 1
    DISCUSS = 2

class RequestStatus(Enum):
    PENDING = 0
    IN_PROCESS = 1
    DONE = 2

class RequestPriorityTypes(Enum):
    CAN_WAIT = 0
    MIDDLE = 1
    IMPORTANT = 2