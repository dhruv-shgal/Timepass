from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from fastapi import FASTAPI, HTTPException, status
import re

MIN_LENGTH = 12

UPPERCASE_REGEX = re.compile(r'[A-Z]')
LOWERCASE_REGEX = re.compile(r'[a-z]')
DIGIT_REGEX = re.compile(r'\d')
SPECIAL_CHAR_REGEX = re.compile(r'[!@#$%^&*()_+-=[]{};:"\\|,.<>/?`~]')

# User Schemas
class UserCreate(BaseModel):
    username: str 
    email: EmailStr
    password: str

    @field_validator('password')
    @classmethod
    def password_length(cls, value):
        if len(value) < MIN_LENGTH:
            raise ValueError('Password must be atleast {MIN_LENGTH} characters long')
        if not UPPERCASE_REGEX.search(value):
            raise ValueError('Password must contain atleast one uppercase letter')
        if not LOWERCASE_REGEX.search(value):
            raise ValueError('Password must contain atleast one lowercase letter')
        if not DIGIT_REGEX.search(value):
            raise ValueError('Password must contain atleast one digit')
        if not SPECIAL_CHAR_REGEX.search(value):
            raise ValueError('Password must contain atleast one special character')
        return value


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