from sqlmodel import select as sql_select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import Optional
from app.models.user import User, UserCreate
from app.core.enums import Role

async def create_user(session: AsyncSession, user_in: UserCreate) -> User:
    user = User(email=user_in.email, full_name=user_in.full_name, role=user_in.role,
                password=user_in.password)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
    result = await session.exec(sql_select(User).where(User.email == email))
    return result.one_or_none()

async def get_user(session: AsyncSession, user_id: int) -> Optional[User]:
    result = await session.exec(sql_select(User).where(User.id == user_id))
    return result.one_or_none()