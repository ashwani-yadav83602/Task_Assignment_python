from datetime import datetime, timezone

from sqlalchemy import case, func, or_
from sqlalchemy.orm import Session, joinedload

from app.models import Comment, Task, TaskStatus, User


class UserRepository:
    def get_by_id(self, db: Session, user_id: int) -> User | None:
        return db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, user_data: dict) -> User:
        user = User(**user_data)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> list[User]:
        return db.query(User).order_by(User.name).offset(skip).limit(limit).all()


class TaskRepository:
    SORTABLE = {
        "created_at": Task.created_at,
        "updated_at": Task.updated_at,
        "due_date": Task.due_date,
        "title": Task.title,
        "status": Task.status,
        "priority": Task.priority,
    }

    def _base_query(self, db: Session):
        return db.query(Task).options(
            joinedload(Task.assignee),
            joinedload(Task.comments).joinedload(Comment.user),
        )

    def get_by_id(self, db: Session, task_id: int) -> Task | None:
        return self._base_query(db).filter(Task.id == task_id).first()

    def create(self, db: Session, task_data: dict) -> Task:
        task = Task(**task_data)
        db.add(task)
        db.commit()
        db.refresh(task)
        return self.get_by_id(db, task.id)

    def _apply_filters(
        self,
        query,
        status: str | None = None,
        priority: str | None = None,
        assignee: int | None = None,
        search: str | None = None,
    ):
        if status:
            query = query.filter(Task.status == status)
        if priority:
            query = query.filter(Task.priority == priority)
        if assignee:
            query = query.filter(Task.assigned_to == assignee)
        if search:
            term = f"%{search}%"
            query = query.filter(or_(Task.title.ilike(term), Task.description.ilike(term)))
        return query

    def _sort_column(self, sort_by: str):
        if sort_by == "priority":
            return case(
                (Task.priority == "Urgent", 4),
                (Task.priority == "High", 3),
                (Task.priority == "Medium", 2),
                else_=1,
            )
        return self.SORTABLE.get(sort_by, Task.created_at)

    def get_paginated(
        self,
        db: Session,
        status: str | None = None,
        priority: str | None = None,
        assignee: int | None = None,
        search: str | None = None,
        sort_by: str = "created_at",
        sort_dir: str = "desc",
        skip: int = 0,
        limit: int = 20,
    ) -> tuple[list[Task], int]:
        count_query = self._apply_filters(db.query(Task), status, priority, assignee, search)
        total = count_query.with_entities(func.count(Task.id)).scalar() or 0
        column = self._sort_column(sort_by)
        items_query = self._apply_filters(self._base_query(db), status, priority, assignee, search)
        items_query = items_query.order_by(column.asc() if sort_dir == "asc" else column.desc())
        items = items_query.offset(skip).limit(limit).all()
        return items, total

    def update(self, db: Session, task: Task, update_data: dict) -> Task:
        for key, value in update_data.items():
            setattr(task, key, value)
        task.updated_at = datetime.now(timezone.utc)
        db.commit()
        return self.get_by_id(db, task.id)

    def delete(self, db: Session, task: Task) -> None:
        db.delete(task)
        db.commit()

    def count_by_status(self, db: Session, status: str | None = None) -> int:
        query = db.query(func.count(Task.id))
        if status:
            query = query.filter(Task.status == status)
        return query.scalar() or 0

    def count_overdue(self, db: Session) -> int:
        now = datetime.now(timezone.utc)
        return (
            db.query(func.count(Task.id))
            .filter(Task.due_date < now, Task.status != TaskStatus.COMPLETED.value)
            .scalar()
            or 0
        )

    def get_assigned_to(self, db: Session, user_id: int, limit: int = 8) -> tuple[list[Task], int]:
        total = db.query(func.count(Task.id)).filter(Task.assigned_to == user_id).scalar() or 0
        items = (
            self._base_query(db)
            .filter(Task.assigned_to == user_id)
            .order_by(Task.due_date.asc())
            .limit(limit)
            .all()
        )
        return items, total


class CommentRepository:
    def create(self, db: Session, data: dict) -> Comment:
        comment = Comment(**data)
        db.add(comment)
        db.commit()
        db.refresh(comment)
        return (
            db.query(Comment)
            .options(joinedload(Comment.user))
            .filter(Comment.id == comment.id)
            .first()
        )

    def list_for_task(self, db: Session, task_id: int) -> list[Comment]:
        return (
            db.query(Comment)
            .options(joinedload(Comment.user))
            .filter(Comment.task_id == task_id)
            .order_by(Comment.created_at.asc())
            .all()
        )
