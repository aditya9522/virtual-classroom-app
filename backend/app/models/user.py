from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from app.core.enums import Role

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True, description="User's email address")
    password: str = Field(max_length=255, description="User's hashed password")
    full_name: Optional[str] = Field(default=None, max_length=255, description="User's full name")
    role: Role = Field(default=Role.STUDENT, description="User role: student, teacher, or admin")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the user was created")

    classes: List["Class"] = Relationship(back_populates="teacher", sa_relationship_kwargs={"cascade": "all, delete, delete-orphan"})
    messages: List["Message"] = Relationship(back_populates="sender", sa_relationship_kwargs={"cascade": "all, delete, delete-orphan"})
    enrollments: List["Enrollment"] = Relationship(back_populates="student", sa_relationship_kwargs={"cascade": "all, delete, delete-orphan"})
