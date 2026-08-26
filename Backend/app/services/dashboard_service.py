from sqlalchemy.orm import Session

from app.models import TaskStatus, User
from app.repositories import TaskRepository


class DashboardService:
    def __init__(self):
        self.tasks = TaskRepository()

    def get_stats(self, db: Session, current_user: User):
        my_tasks, my_count = self.tasks.get_assigned_to(db, current_user.id)
        return {
            "total_tasks": self.tasks.count_by_status(db),
            "pending_tasks": self.tasks.count_by_status(db, TaskStatus.PENDING.value),
            "in_progress_tasks": self.tasks.count_by_status(db, TaskStatus.IN_PROGRESS.value),
            "completed_tasks": self.tasks.count_by_status(db, TaskStatus.COMPLETED.value),
            "overdue_tasks": self.tasks.count_overdue(db),
            "my_tasks_count": my_count,
            "my_tasks": my_tasks,
        }
