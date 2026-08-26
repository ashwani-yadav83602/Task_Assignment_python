import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.security import hash_password
from app.database import Base, get_db
from app.main import app
from app.models import Task, TaskPriority, TaskStatus, User, UserRole

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(bind=engine, autocommit=False, autoflush=False)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSession()
    admin = User(
        name="Admin",
        email="admin@test.local",
        hashed_password=hash_password("Admin123!"),
        role=UserRole.ADMIN.value,
    )
    member = User(
        name="Member",
        email="member@test.local",
        hashed_password=hash_password("Member123!"),
        role=UserRole.MEMBER.value,
    )
    session.add_all([admin, member])
    session.flush()
    session.add(
        Task(
            title="Overdue invoice",
            description="Pay vendor",
            status=TaskStatus.PENDING.value,
            priority=TaskPriority.HIGH.value,
            assigned_to=member.id,
            created_by=admin.id,
        )
    )
    session.commit()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def login(client: TestClient, email: str, password: str) -> str:
    response = client.post("/api/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    return response.json()["access_token"]
