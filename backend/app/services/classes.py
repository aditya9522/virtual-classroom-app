from sqlmodel import select as sql_select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from app.models.classroom import Class
from app.schemas.classroom import ClassCreate
from app.models.user import User
from app.services.enrollments import get_enrolled_class_ids
from app.core.enums import Role
from app.utils.datetime import to_naive_utc

async def create_class(session: AsyncSession, class_in: ClassCreate, teacher_id: int) -> Class:
    data = class_in.dict()
    data.pop("teacher_id", None)
    data["scheduled_at"] = to_naive_utc(data.get("scheduled_at"))
    
    cls = Class(**data, teacher_id=teacher_id)
    session.add(cls)
    await session.commit()
    await session.refresh(cls)
    return cls

async def list_classes(session: AsyncSession, user: User, skip: int = 0, limit: int = 100) -> List[Class]:
    result = await session.exec(sql_select(Class).offset(skip).limit(limit))
    return result.all()

async def get_class(session: AsyncSession, class_id: int) -> Optional[Class]:
    result = await session.exec(sql_select(Class).where(Class.id == class_id))
    return result.one_or_none()