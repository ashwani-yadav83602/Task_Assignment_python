from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models import Task, User, UserRole
from app.repositories import CommentRepository, TaskRepository, UserRepository
from app.schemas import CommentCreate, TaskCreate, TaskUpdate


class TaskService:
    def __init__(self):
        self.tasks = TaskRepository()
        self.comments = CommentRepository()
        self.users = UserRepository()

    def _can_manage(self, user: User, task: Task) -> bool:
        if user.role == UserRole.ADMIN.value:
            return True
        return task.created_by == user.id or task.assigned_to == user.id

    def _ensure_assignee(self, db: Session, assigned_to: int | None) -> None:
        if assigned_to is None:
            return
        if not self.users.get_by_id(db, assigned_to):
            raise AppError("Assigned user not found", status_code=404, code="assignee_not_found")

    def create_task(self, db: Session, payload: TaskCreate, actor: User) -> Task:
        self._ensure_assignee(db, payload.assigned_to)
        data = payload.model_dump()
        data["status"] = payload.status.value
        data["priority"] = payload.priority.value
        data["created_by"] = actor.id
        return self.tasks.create(db, data)

    def list_tasks(
        self,
        db: Session,
        status: str | None,
        priority: str | None,
        assignee: int | None,
        search: str | None,
        sort_by: str,
        sort_dir: str,
        page: int,
        limit: int,
    ) -> tuple[list[Task], int]:
        skip = (page - 1) * limit
        return self.tasks.get_paginated(
            db, status, priority, assignee, search, sort_by, sort_dir, skip, limit
        )

    def get_task(self, db: Session, task_id: int) -> Task:
        task = self.tasks.get_by_id(db, task_id)
        if not task:
            raise AppError("Task not found", status_code=404, code="task_not_found")
        return task

    def update_task(self, db: Session, task_id: int, payload: TaskUpdate, actor: User) -> Task:
        task = self.get_task(db, task_id)
        if not self._can_manage(actor, task):
            raise AppError("You cannot update this task", status_code=403, code="forbidden")
        data = payload.model_dump(exclude_unset=True)
        if "assigned_to" in data:
            self._ensure_assignee(db, data["assigned_to"])
        if "status" in data and data["status"] is not None:
            data["status"] = data["status"].value
        if "priority" in data and data["priority"] is not None:
            data["priority"] = data["priority"].value
        return self.tasks.update(db, task, data)

    def delete_task(self, db: Session, task_id: int, actor: User) -> None:
        task = self.get_task(db, task_id)
        if actor.role != UserRole.ADMIN.value and task.created_by != actor.id:
            raise AppError("You cannot delete this task", status_code=403, code="forbidden")
        self.tasks.delete(db, task)

    def add_comment(self, db: Session, task_id: int, payload: CommentCreate, actor: User):
        task = self.get_task(db, task_id)
        if not self._can_manage(actor, task) and actor.role != UserRole.ADMIN.value:
            # members can comment on any task they can view; all authenticated users can view
            pass
        return self.comments.create(
            db,
            {"task_id": task.id, "user_id": actor.id, "comment": payload.comment},
        )
