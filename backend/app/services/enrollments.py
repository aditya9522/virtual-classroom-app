from sqlmodel import select as sql_select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional
from app.models.classroom import Class
from app.models.enrollment import Enrollment

async def enroll_student(session: AsyncSession, class_id: int, student_id: int) -> Enrollment:
    enrollment = Enrollment(class_id=class_id, student_id=student_id)
    session.add(enrollment)
    await session.commit()
    await session.refresh(enrollment)
    return enrollment

async def unenroll_student(session: AsyncSession, class_id: int, student_id: int) -> Enrollment:
    result = await session.exec(sql_select(Enrollment).where(Enrollment.class_id == class_id, Enrollment.student_id == student_id))
    enrollment = result.one_or_none()
    if enrollment:
        await session.delete(enrollment)
        await session.commit()
    return enrollment

async def list_enrolled_students(session: AsyncSession, class_id: int) -> List[Enrollment]:
    result = await session.exec(sql_select(Enrollment).where(Enrollment.class_id == class_id))
    return result.all()

async def get_enrolled_class_ids(session: AsyncSession, student_id: int) -> List[int]:
    result = await session.exec(sql_select(Enrollment.class_id).where(Enrollment.student_id == student_id))
    return [row[0] for row in result.all()]

async def is_user_enrolled_or_teacher(session: AsyncSession, class_id: int, user_id: int) -> bool:
    # Check if user is the teacher
    result = await session.exec(sql_select(Class).where(Class.id == class_id, Class.teacher_id == user_id))
    if result.first():
        return True
        
    # Check if user is enrolled as a student
    result = await session.exec(sql_select(Enrollment).where(Enrollment.class_id == class_id, Enrollment.student_id == user_id))
    return result.first() is not None