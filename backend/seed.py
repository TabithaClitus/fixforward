from database import SessionLocal, engine
import models
from datetime import datetime
import hashlib

# Password hashing function (same as in main.py)
SECRET_KEY = "SCCIN_SUPER_SECRET_KEY"

def get_password_hash(password: str) -> str:
    """Hash password using SHA256 with salt"""
    return hashlib.sha256(f"{password}{SECRET_KEY}".encode()).hexdigest()

# Initialize DB
models.Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    
    # 1. Create Admin
    # Delete existing to update hash
    db.query(models.User).filter(models.User.phone == "123").delete()
    
    admin = models.User(
        name="Emergency Admin",
        phone="123",
        # Hash for password "admin"
        hashed_password=get_password_hash("admin"),
        role="admin"
    )
    db.add(admin)

    # 2. Add some Initial Alerts
    alerts = [
        models.Alert(
            title="Heavy Rainfall Warning",
            message="IMD predicts heavy rainfall in the next 24 hours. Residents are advised to stay indoors and avoid low-lying areas.",
            priority="High",
            timestamp=datetime.utcnow()
        ),
        models.Alert(
            title="Relief Camp Setup",
            message="Relief camps have been set up at Govt Higher Secondary School. Food and water are available for all.",
            priority="Medium",
            timestamp=datetime.utcnow()
        )
    ]
    for a in alerts:
        db.add(a)

    db.commit()
    print("Seeding complete.")

if __name__ == "__main__":
    seed()
