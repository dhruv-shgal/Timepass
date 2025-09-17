from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, auth

router = APIRouter(prefix="/interviews", tags=["interviews"])

@router.get("/")
def get_interviews(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    """Get user's interviews (placeholder)"""
    return {"message": "Interview routes coming soon", "user_id": current_user.id}