from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    phone: str
    role: str
    language_preference: Optional[str] = "en"

class UserLogin(BaseModel):
    phone: str
    password: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    phone: Optional[str] = None

class AlertBase(BaseModel):
    title: str
    message: str
    priority: str
    scope: Optional[str] = "global"

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    timestamp: datetime
    verified: bool

    class Config:
        from_attributes = True

class ReportBase(BaseModel):
    content: str
    location: str

class ReportCreate(ReportBase):
    is_offline_collected: Optional[bool] = False

class Report(ReportBase):
    id: int
    user_id: int
    status: str
    timestamp: datetime
    is_offline_collected: bool

    class Config:
        from_attributes = True

class AIAnalysisRequest(BaseModel):
    text: str

class AIAnalysisResponse(BaseModel):
    classification: str # Verified / Suspicious / Fake
    confidence: float
    reason: str
