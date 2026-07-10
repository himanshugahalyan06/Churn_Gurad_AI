import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# -------------------------------
# Database Configuration
# -------------------------------
# Use PostgreSQL from env if available, otherwise SQLite fallback
BASE_DIR = Path(__file__).resolve().parents[3]
FALLBACK_DB = BASE_DIR / "churnguard.db"

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    f"sqlite:///{FALLBACK_DB}"
)

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)