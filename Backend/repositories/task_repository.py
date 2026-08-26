from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
from models import Task
from typing import Optional

class TaskRepository:
    def get_by_id(self, db: Session, task_id: int):
        return db.query(Task).filter(Task.id == task_id).first()

    def create(self, db: Session, task_data: dict):
        new_task = Task(**task_data)
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return new_task

    def get_all(self, db: Session, status: Optional[str] = None, priority: Optional[str] = None, assignee: Optional[int] = None, search: Optional[str] = None, skip: int = 0, limit: int = 20):
        query = db.query(Task)
        if status:
            query = query.filter(Task.status == status)
        if priority:
            query = query.filter(Task.priority == priority)
        if assignee:
            query = query.filter(Task.assigned_to == assignee)
        if search:
            search_term = f"%{search}%"
            query = query.filter(or_(Task.title.ilike(search_term), Task.description.ilike(search_term)))
        
        return query.offset(skip).limit(limit).all()

    def update(self, db: Session, db_task: Task, update_data: dict):
        for key, value in update_data.items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
        return db_task

    def delete(self, db: Session, db_task: Task):
        db.delete(db_task)
        db.commit()

    def count_by_status(self, db: Session, status: Optional[str] = None):
        if status:
            return db.query(Task).filter(Task.status == status).count()
        return db.query(Task).count()

    def count_overdue(self, db: Session):
        current_time = datetime.utcnow()
        return db.query(Task).filter(
            Task.due_date < current_time,
            Task.status != "Completed"
        ).count()
