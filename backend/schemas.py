from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str  # "student" or "mentor"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class EnrollRequest(BaseModel):
    track_id: int
    mentor_id: int

class SubmissionCreate(BaseModel):
    lesson_id: int
    title: str
    description: str
    repo_link: str

class SubmissionReview(BaseModel):
    status: str  # "approved" or "rejected"

class MentorOut(BaseModel):
    id: int
    name: str
    specialty: str
    avatar: str
    students: int
