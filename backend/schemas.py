from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str | None = None
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

    @property 
    def profile_initial(self) -> str:
        """Get profile initial from email"""
        return self.email[0].upper()

# Profile Schemas
class ProfileCreate(BaseModel):
    name: Optional[str] = None
    career_goals: Optional[str] = None
    education: Optional[str] = None
    skills: Optional[str] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    career_goals: Optional[str] = None
    education: Optional[str] = None
    skills: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    name: Optional[str]
    career_goals: Optional[str]
    education: Optional[str]
    skills: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

    @property 
    def profile_initial(self) -> str:
        """Get profile initial from email"""
        return self.email[0].upper()

# Auth Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse