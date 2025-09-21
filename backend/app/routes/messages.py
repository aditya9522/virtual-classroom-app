from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession
from app.database import get_session
from app.deps import get_current_user
from app.services.messages import list_messages_for_class, save_message
from app.schemas.message import MessageResponse, MessageCreate
from app.services.enrollments import is_user_enrolled_or_teacher
from app.models.user import User
from app.core.enums import Role

router = APIRouter(prefix='/classes/{class_id}/messages', tags=['messages'])

@router.get('', response_model=List[MessageResponse])
async def get_class_messages(
    class_id: int,
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 200,
    session: AsyncSession = Depends(get_session)
):
    if not await is_user_enrolled_or_teacher(session, class_id, current_user.id):
        raise HTTPException(status_code=403, detail='Not authorized for this class')
    msgs = await list_messages_for_class(session, class_id, skip, limit)
    return msgs

@router.post('', response_model=MessageResponse)
async def send_message(
    class_id: int,
    message_in: MessageCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if not await is_user_enrolled_or_teacher(session, class_id, current_user.id):
        raise HTTPException(status_code=403, detail='Not authorized for this class')
    try:
        message = await save_message(session, class_id, current_user.id, message_in.content)
        return message
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))