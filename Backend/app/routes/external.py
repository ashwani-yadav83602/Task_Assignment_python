from fastapi import APIRouter, Depends

from app.core.deps import get_current_user
from app.integrations.jsonplaceholder import ExternalDirectoryClient
from app.models import User
from app.schemas import ExternalUser

router = APIRouter(prefix="/api/external", tags=["external"])
client = ExternalDirectoryClient()


@router.get("/users", response_model=list[ExternalUser])
def list_external_users(_current_user: User = Depends(get_current_user)):
    return client.fetch_users()
