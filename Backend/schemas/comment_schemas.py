from pydantic import BaseModel, EmailStr
from datetime import datetime
# --- Comment Schemas ---
class CommentBase(BaseModel):
    comment: str

class CommentCreate(CommentBase):
    task_id: int
    user_id: int

class CommentResponse(CommentBase):
    id: int
    task_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True