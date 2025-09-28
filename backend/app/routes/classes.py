from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession
from app.database import get_session
from app.deps import get_current_user
from app.services.classes import create_class, list_classes, get_class
from app.schemas.classroom import ClassCreate, ClassResponse
from app.models.user import User
from app.core.enums import Role

router = APIRouter(prefix='/classes', tags=['classes'])

@router.post('', response_model=ClassResponse)
async def create_class_endpoint(
    class_in: ClassCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if current_user.role not in [Role.TEACHER, Role.ADMIN]:
        raise HTTPException(status_code=403, detail='Only teachers or admins can create classes')

    if class_in.teacher_id:
        user = await session.get(User, class_in.teacher_id)
        if not user or user.role != Role.TEACHER:
            raise HTTPException(status_code=400, detail='Invalid teacher_id')
        
        teacher_id = user.id
    else: 
        teacher_id = current_user.id
    cls = await create_class(session, class_in, teacher_id=teacher_id)
    return cls


@router.put('/{class_id}', response_model=ClassResponse)
async def update_class_endpoint(
    class_id: int,
    class_in: ClassCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    cls = await get_class(session, class_id)
    if not cls:
        raise HTTPException(status_code=404, detail='Class not found')
    
    if current_user.role != Role.ADMIN or current_user.id != cls.teacher_id:
        raise HTTPException(status_code=403, detail='Not authorized to update classes')
        
    cls = await create_class(session, class_in, teacher_id=cls.teacher_id)
    return cls


@router.delete('/{class_id}')
async def delete_class_endpoint(
    class_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    cls = await get_class(session, class_id)
    if not cls:
        raise HTTPException(status_code=404, detail='Class not found')
    if current_user.role != Role.ADMIN or current_user.id != cls.teacher_id:
        raise HTTPException(status_code=403, detail='Not authorized to delete classes')
    
    await session.delete(cls)
    await session.commit()
    return {'message': 'Class deleted successfully'}     


@router.get('', response_model=List[ClassResponse])
async def list_classes_endpoint(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    return await list_classes(session, current_user, skip, limit)

@router.get('/{class_id}', response_model=ClassResponse)
async def get_class_endpoint(
    class_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    cls = await get_class(session, class_id)
    if not cls:
        raise HTTPException(status_code=404, detail='Class not found')
    if current_user.role == Role.ADMIN or (current_user.role == Role.TEACHER and cls.teacher_id == current_user.id):
        return cls
    raise HTTPException(status_code=403, detail='Not authorized for this class')
