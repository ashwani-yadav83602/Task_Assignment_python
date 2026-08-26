from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.database import SessionLocal
from app.models import Comment, Task, TaskPriority, TaskStatus, User, UserRole


def seed(db: Session) -> None:
    if db.query(User).first():
        print("Database already has users. Skipping seed.")
        return

    admin = User(
        name="Avery Admin",
        email="admin@taskflow.local",
        hashed_password=hash_password("Admin123!"),
        role=UserRole.ADMIN.value,
    )
    alex = User(
        name="Alex Rivera",
        email="alex@taskflow.local",
        hashed_password=hash_password("Member123!"),
        role=UserRole.MEMBER.value,
    )
    jordan = User(
        name="Jordan Lee",
        email="jordan@taskflow.local",
        hashed_password=hash_password("Member123!"),
        role=UserRole.MEMBER.value,
    )
    db.add_all([admin, alex, jordan])
    db.flush()

    now = datetime.now(timezone.utc)
    tasks = [
        Task(
            title="Prepare Q3 hiring plan",
            description="Draft roles, budgets, and interview loop for engineering hires.",
            status=TaskStatus.IN_PROGRESS.value,
            priority=TaskPriority.HIGH.value,
            assigned_to=alex.id,
            created_by=admin.id,
            due_date=now + timedelta(days=5),
        ),
        Task(
            title="Fix overdue invoice reminders",
            description="Finance needs reminder emails for unpaid invoices.",
            status=TaskStatus.PENDING.value,
            priority=TaskPriority.URGENT.value,
            assigned_to=jordan.id,
            created_by=admin.id,
            due_date=now - timedelta(days=2),
        ),
        Task(
            title="Update onboarding checklist",
            description="Add laptop, Slack, and repo access steps.",
            status=TaskStatus.COMPLETED.value,
            priority=TaskPriority.MEDIUM.value,
            assigned_to=alex.id,
            created_by=jordan.id,
            due_date=now - timedelta(days=10),
        ),
        Task(
            title="Blocked: vendor SSO",
            description="Waiting on vendor to enable SAML metadata.",
            status=TaskStatus.BLOCKED.value,
            priority=TaskPriority.HIGH.value,
            assigned_to=jordan.id,
            created_by=admin.id,
            due_date=now + timedelta(days=12),
        ),
        Task(
            title="Design TaskFlow dashboard copy",
            description="Write empty states and helper text for the internal dashboard.",
            status=TaskStatus.PENDING.value,
            priority=TaskPriority.LOW.value,
            assigned_to=alex.id,
            created_by=admin.id,
            due_date=now + timedelta(days=14),
        ),
    ]
    db.add_all(tasks)
    db.flush()

    db.add_all(
        [
            Comment(task_id=tasks[0].id, user_id=admin.id, comment="Please include contractor vs FTE split."),
            Comment(task_id=tasks[0].id, user_id=alex.id, comment="First draft is in the shared doc."),
            Comment(task_id=tasks[1].id, user_id=jordan.id, comment="Need the Stripe export before I can start."),
        ]
    )
    db.commit()
    print("Seed complete. Login as admin@taskflow.local / Admin123!")


if __name__ == "__main__":
    session = SessionLocal()
    try:
        seed(session)
    finally:
        session.close()
