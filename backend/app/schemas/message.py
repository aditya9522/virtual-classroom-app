from pydantic import BaseModel
from datetime import datetime

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    class_id: int
    sender_id: int
    content: str
    created_at: datetime