from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user") # admin/user
    language_preference = Column(String, default="en")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    message = Column(Text)
    priority = Column(String) # High, Medium, Low
    timestamp = Column(DateTime, default=datetime.utcnow)
    verified = Column(Boolean, default=True)
    scope = Column(String, default="global") # global / area code

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    location = Column(String)
    status = Column(String, default="pending") # pending, verified, dismissed
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_offline_collected = Column(Boolean, default=False)

    user = relationship("User")
