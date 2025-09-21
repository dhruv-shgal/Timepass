from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=schemas.Token)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register new user"""
    # Check if user exists with either email or username
    db_user_email = db.query(models.User).filter(models.User.email == user.email).first()
    db_user_username = db.query(models.User).filter(models.User.username == user.username).first()
    
    if db_user_email or db_user_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already registered"
        )
    
    # Hash password and create user
    hashed_password = auth.hash_password(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email, 
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create empty profile
    db_profile = models.Profile(user_id=db_user.id)
    db.add(db_profile)
    db.commit()
    
    # Create access token
    access_token = auth.create_access_token(data={"sub": db_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@router.post("/login", response_model=schemas.Token)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login user with username or email"""
    # Check if login is email or username
    is_email = "@" in user.login
    
    if is_email:
        # Login via email
        db_user = db.query(models.User).filter(models.User.email == user.login).first()
    else:
        # Login via username
        db_user = db.query(models.User).filter(models.User.username == user.login).first()
    
    if not db_user or not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = auth.create_access_token(data={"sub": db_user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    """Get current user info"""
    return current_user