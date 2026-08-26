from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.core.security import create_access_token, hash_password, verify_password
from app.models import User, UserRole
from app.repositories import UserRepository
from app.schemas import LoginRequest, UserCreate


class UserService:
    def __init__(self):
        self.repo = UserRepository()

    def create_user(self, db: Session, payload: UserCreate, actor: User | None = None) -> User:
        if actor and actor.role != UserRole.ADMIN.value:
            raise AppError("Only admins can create users", status_code=403, code="forbidden")
        if self.repo.get_by_email(db, payload.email):
            raise AppError("Email already registered", status_code=409, code="email_taken")
        data = payload.model_dump()
        password = data.pop("password")
        data["hashed_password"] = hash_password(password)
        data["role"] = payload.role.value if hasattr(payload.role, "value") else payload.role
        return self.repo.create(db, data)

    def authenticate(self, db: Session, payload: LoginRequest) -> tuple[str, User]:
        user = self.repo.get_by_email(db, payload.email)
        if not user or not verify_password(payload.password, user.hashed_password):
            raise AppError("Invalid email or password", status_code=401, code="invalid_credentials")
        token = create_access_token(user.id, user.role)
        return token, user

    def get_users(self, db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        return self.repo.get_all(db, skip=skip, limit=limit)

    def get_by_id(self, db: Session, user_id: int) -> User:
        user = self.repo.get_by_id(db, user_id)
        if not user:
            raise AppError("User not found", status_code=404, code="user_not_found")
        return user
