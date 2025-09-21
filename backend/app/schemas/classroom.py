from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClassCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None

class ClassResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    scheduled_at: Optional[datetime]
    teacher_id: Optional[int]
    created_at: datetime