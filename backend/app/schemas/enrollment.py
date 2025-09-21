from pydantic import BaseModel
from datetime import datetime

class EnrollmentCreate(BaseModel):
    pass

class EnrollmentResponse(BaseModel):
    id: int
    class_id: int
    student_id: int
    enrolled_at: datetime