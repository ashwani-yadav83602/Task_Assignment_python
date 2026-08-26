from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_admin
from app.database import get_db
from app.models import User
from app.schemas import LoginRequest, TokenResponse, UserCreate, UserPublic
from app.services.user_service import UserService

router = APIRouter(tags=["auth"])
user_service = UserService()


@router.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token, user = user_service.authenticate(db, payload)
    return TokenResponse(access_token=token, user=user)


@router.get("/api/auth/me", response_model=UserPublic)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/api/users", response_model=UserPublic, status_code=201)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return user_service.create_user(db, payload, actor=current_user)


@router.get("/api/users", response_model=list[UserPublic])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    return user_service.get_users(db, skip=skip, limit=limit)
