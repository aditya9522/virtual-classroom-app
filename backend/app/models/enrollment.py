from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class Enrollment(SQLModel, table=True):
    __tablename__ = "enrollments"

    id: Optional[int] = Field(default=None, primary_key=True)
    class_id: int = Field(foreign_key="classes.id", description="ID of the class")
    student_id: int = Field(foreign_key="users.id", description="ID of the enrolled student")
    enrolled_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the student enrolled")

    class_: "Class" = Relationship(back_populates="enrollments")
    student: "User" = Relationship(back_populates="enrollments")
