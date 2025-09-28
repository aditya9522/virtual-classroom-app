from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClassCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: datetime
    teacher_id: int

class ClassResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    scheduled_at: datetime
    teacher_id: int
    created_at: datetime