from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class Class(SQLModel, table=True):
    __tablename__ = "classes"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=255, description="Title of the class")
    description: Optional[str] = Field(default=None, max_length=1000, description="Optional description of the class")
    scheduled_at: Optional[datetime] = Field(default=None, description="Scheduled datetime for the class")
    teacher_id: int = Field(None, foreign_key="users.id", description="ID of the teacher owning the class")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the class was created")

    teacher: Optional["User"] = Relationship(back_populates="classes")
    messages: List["Message"] = Relationship(back_populates="class_", sa_relationship_kwargs={"cascade": "all, delete, delete-orphan"})
    enrollments: List["Enrollment"] = Relationship(back_populates="class_", sa_relationship_kwargs={"cascade": "all, delete, delete-orphan"})
