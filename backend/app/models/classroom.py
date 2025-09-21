from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class ClassBase(SQLModel):
    title: str = Field(max_length=255, description="Title of the class")
    description: Optional[str] = Field(default=None, max_length=1000, description="Optional description of the class")
    scheduled_at: Optional[datetime] = Field(default=None, description="Scheduled datetime for the class")

class Class(ClassBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    teacher_id: Optional[int] = Field(default=None, foreign_key='user.id', description="ID of the teacher owning the class")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the class was created")

    # Relationships
    teacher: Optional['User'] = Relationship(back_populates='classes')
    messages: List['Message'] = Relationship(back_populates='classroom')
    enrollments: List['Enrollment'] = Relationship(back_populates='classroom')

class ClassCreate(ClassBase):
    pass