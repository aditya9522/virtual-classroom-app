from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from app.database import get_session
from app.deps import get_current_user
from app.services.enrollments import enroll_student, unenroll_student, list_enrolled_students
from app.schemas.enrollment import EnrollmentCreate, EnrollmentResponse
from app.models.user import User
from typing import List
from app.core.enums import Role

router = APIRouter(prefix='/classes/{class_id}/enrollments', tags=['enrollments'])

@router.post('', response_model=EnrollmentResponse)
async def enroll(
    class_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if current_user.role != Role.STUDENT:
        raise HTTPException(status_code=403, detail='Only students can enroll')
    return await enroll_student(session, class_id, current_user.id)

@router.delete('', response_model=EnrollmentResponse)
async def unenroll(
    class_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if current_user.role != Role.STUDENT:
        raise HTTPException(status_code=403, detail='Only students can unenroll')
    return await unenroll_student(session, class_id, current_user.id)

@router.get('', response_model=List[EnrollmentResponse])
async def list_enrollments(
    class_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if current_user.role not in [Role.TEACHER, Role.ADMIN]:
        raise HTTPException(status_code=403, detail='Only teachers or admins can list enrollments')
    return await list_enrolled_students(session, class_id)