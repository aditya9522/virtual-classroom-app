from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.core.enums import Role

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    role: Role = Role.STUDENT

class UserUpdate(BaseModel):
    email: Optional[str]
    password: Optional[str]
    full_name: Optional[str]

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Role = Role.STUDENT

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: Role
    created_at: datetime