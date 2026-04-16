import asyncio
from typing import List, Dict
from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
import hashlib
import hmac

import models, schemas, database, ai_engine

# Auth Config
SECRET_KEY = "SCCIN_SUPER_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3000 # Long for prototype

# Simple password hashing (no bcrypt issues)
def get_password_hash(password: str) -> str:
    """Hash password using SHA256 with salt"""
    return hashlib.sha256(f"{password}{SECRET_KEY}".encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password by comparing hashes"""
    return get_password_hash(plain_password) == hashed_password

app = FastAPI(title="SCCIN - Smart Centralized Communication & Information Network")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB Initialization
models.Base.metadata.create_all(bind=database.engine)

# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Endpoints
@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.phone == user.phone).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        name=user.name,
        phone=user.phone,
        hashed_password=hashed_password,
        role=user.role,
        language_preference=user.language_preference
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(form_data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.phone == form_data.phone).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect phone or password")
    
    access_token = create_access_token(data={"sub": user.phone, "role": user.role})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "id": user.id,
            "name": user.name,
            "phone": user.phone,
            "role": user.role,
            "language_preference": user.language_preference
        }
    }

@app.get("/alerts", response_model=List[schemas.Alert])
def get_alerts(db: Session = Depends(database.get_db)):
    return db.query(models.Alert).order_by(models.Alert.timestamp.desc()).all()

@app.post("/alerts/create", response_model=schemas.Alert)
async def create_alert(alert: schemas.AlertCreate, db: Session = Depends(database.get_db)):
    new_alert = models.Alert(**alert.dict())
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    
    # Broadcast through WebSockets
    await manager.broadcast({
        "type": "NEW_ALERT",
        "data": {
            "id": new_alert.id,
            "title": new_alert.title,
            "message": new_alert.message,
            "priority": new_alert.priority,
            "timestamp": new_alert.timestamp.isoformat()
        }
    })
    return new_alert

@app.post("/reports", response_model=schemas.Report)
def create_report(report: schemas.ReportCreate, user_id: int, db: Session = Depends(database.get_db)):
    new_report = models.Report(
        user_id=user_id,
        content=report.content,
        location=report.location,
        is_offline_collected=report.is_offline_collected
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@app.post("/analyze", response_model=schemas.AIAnalysisResponse)
def analyze_content(req: schemas.AIAnalysisRequest):
    detector = ai_engine.get_detector()
    classification, confidence, reason = detector.analyze(req.text)
    return {
        "classification": classification,
        "confidence": confidence,
        "reason": reason
    }

@app.post("/sync-reports")
def sync_reports(reports: List[schemas.ReportCreate], user_id: int, db: Session = Depends(database.get_db)):
    synced_count = 0
    for r in reports:
        new_report = models.Report(
            user_id=user_id,
            content=r.content,
            location=r.location,
            is_offline_collected=True
        )
        db.add(new_report)
        synced_count += 1
    db.commit()
    return {"status": "success", "synced": synced_count}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text() # Keep alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
