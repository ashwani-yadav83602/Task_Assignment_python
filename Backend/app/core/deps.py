from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.core.security import decode_access_token
from app.database import get_db
from app.models import User, UserRole
from app.repositories import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
user_repo = UserRepository()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise AppError("Invalid token", status_code=401, code="invalid_token")
    user = user_repo.get_by_id(db, int(user_id))
    if not user:
        raise AppError("User not found", status_code=401, code="user_not_found")
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN.value:
        raise AppError("Admin access required", status_code=403, code="forbidden")
    return current_user
