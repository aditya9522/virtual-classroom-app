from sqlmodel import select as sql_select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from app.models.message import Message

async def save_message(session: AsyncSession, class_id: int, sender_id: int, content: str) -> Message:
    msg = Message(class_id=class_id, sender_id=sender_id, content=content)
    session.add(msg)
    await session.commit()
    await session.refresh(msg)
    return msg

async def list_messages_for_class(session: AsyncSession, class_id: int, skip: int = 0, limit: int = 200):
    result = await session.exec(sql_select(Message).where(Message.class_id == class_id).offset(skip).limit(limit).order_by(Message.created_at))
    return result.all()

