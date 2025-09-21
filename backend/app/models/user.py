from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from app.core.enums import Role

class UserBase(SQLModel):
    email: str = Field(max_length=255, unique=True, index=True, description="User's email address")
    full_name: Optional[str] = Field(default=None, max_length=255, description="User's full name")
    role: Role = Field(default=Role.STUDENT, description="User role: student, teacher, or admin")

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password: str = Field(max_length=255, description="User's hashed password")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the user was created")

    # Relationships
    classes: List['Class'] = Relationship(back_populates='teacher')
    messages: List['Message'] = Relationship(back_populates='sender')
    enrollments: List['Enrollment'] = Relationship(back_populates='student')

class UserCreate(UserBase):
    password: str