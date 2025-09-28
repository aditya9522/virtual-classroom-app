from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field(max_length=2000, description="Content of the message")
    class_id: int = Field(foreign_key="classes.id", description="ID of the class the message belongs to")
    sender_id: int = Field(foreign_key="users.id", description="ID of the user sending the message")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the message was created")

    class_: "Class" = Relationship(back_populates="messages")
    sender: "User" = Relationship(back_populates="messages")
