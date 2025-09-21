from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class MessageBase(SQLModel):
    content: str = Field(max_length=2000, description="Content of the message")

class Message(MessageBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    class_id: int = Field(foreign_key='class.id', description="ID of the class the message belongs to")
    sender_id: int = Field(foreign_key='user.id', description="ID of the user sending the message")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp when the message was created")

    # Relationships
    classroom: 'Class' = Relationship(back_populates='messages')
    sender: 'User' = Relationship(back_populates='messages')

class MessageCreate(MessageBase):
    pass