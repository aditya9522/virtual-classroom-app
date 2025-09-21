from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import timedelta
from app.database import get_session
from app.models.user import User
from app.services.users import create_user, get_user_by_email
from app.core.security import get_password_hash, verify_password
from app.schemas.user import UserCreate, LoginRequest, UserResponse, UserUpdate
from app.schemas.token import Token
from app.core.security import create_access_token
from app.core.enums import Role
from app.core.config import settings
from app.deps import get_current_user

router = APIRouter(prefix='/auth', tags=['auth'])

@router.post('/signup', response_model=Token)
async def signup(user_in: UserCreate, session: AsyncSession = Depends(get_session)):
    existing = await get_user_by_email(session, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')

    user_in.password = get_password_hash(user_in.password)
    user = await create_user(session, user_in)
    access_token = create_access_token(subject=str(user.id))
    return {'token': access_token, 'token_type': 'bearer'}

@router.post('/login', response_model=Token)
async def login(login_request: LoginRequest, session: AsyncSession = Depends(get_session)):
    user = await get_user_by_email(session, login_request.email)
    if not user or not verify_password(login_request.password, user.password) or login_request.role != user.role:
        raise HTTPException(status_code=400, detail='Incorrect credentials')
    access_token = create_access_token(subject=str(user.id), expires_delta=timedelta(minutes=int(settings.ACCESS_TOKEN_EXPIRE_MINUTES)))
    return { 'token': access_token, 'token_type': 'bearer'}


# @router.post('/login', response_model=Token)
# async def login(login_request: OAuth2PasswordRequestForm = Depends(), session: AsyncSession = Depends(get_session)):
#     user = await get_user_by_email(session, login_request.username)

#     if not user or not verify_password(login_request.password, user.password):
#         raise HTTPException(status_code=400, detail='Incorrect credentials')
    
#     token_expiry_time = int(settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(subject=str(user.id), expires_delta=timedelta(minutes=token_expiry_time))
#     return { 'token': access_token, 'token_type': 'bearer'}


@router.get("/users", response_model=list[UserResponse])
async def get_all_users(current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")
    result = await session.execute(select(User).where(User.id != current_user.id, User.role != Role.STUDENT))
    users = result.scalars().all()
    return users

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    access_token = create_access_token(
        subject=str(current_user.id),
        expires_delta=timedelta(minutes=int(settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    )
    return {
        **current_user.dict(exclude={"password"}),
        "token": access_token,
        "token_type": "bearer"
    }

@router.patch("/me", response_model=User)
async def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    if user_update.email:
        existing_user = await get_user_by_email(session, user_update.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already in use")

    if user_update.password:
        user_update.password = get_password_hash(user_update.password)

    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, key, value)

    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)
    return current_user