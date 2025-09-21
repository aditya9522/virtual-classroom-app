# app/models/enrollment.py
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class EnrollmentBase(SQLModel):
    pass

class Enrollment(EnrollmentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    class_id: int = Field(foreign_key='class.id', description="ID of the class")
    student_id: int = Field(foreign_key='user.id', description="ID of the enrolled student")
    enrolled_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the student enrolled")

    # Relationships
    classroom: 'Class' = Relationship(back_populates='enrollments')
    student: 'User' = Relationship(back_populates='enrollments')

class EnrollmentCreate(EnrollmentBase):
    pass