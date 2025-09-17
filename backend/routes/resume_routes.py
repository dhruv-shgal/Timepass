from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, auth

router = APIRouter(prefix="/resumes", tags=["resumes"])

@router.get("/")
def get_resumes(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    """Get user's resumes (placeholder)"""
    return {"message": "Resume routes coming soon", "user_id": current_user.id}