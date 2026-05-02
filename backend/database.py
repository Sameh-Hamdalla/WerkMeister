# Verbindung zur Datenbank herstellen
from sqlalchemy import create_engine

# Tools für Sessions und Models
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite Datei (wird automatisch erstellt)
DATABASE_URL = "sqlite:///./tools.db"

# Engine = zentrale Verbindung zur DB
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # wichtig für SQLite + FastAPI
)

# Session = einzelne Verbindung pro Request
SessionLocal = sessionmaker(
    autocommit=False,  # wir entscheiden selbst wann gespeichert wird
    autoflush=False,  # verhindert automatische DB Aktionen
    bind=engine,
)

# Base = Grundlage für alle Tabellen (Models)
Base = declarative_base()


# Dependency für FastAPI
# 👉 sorgt dafür, dass jede Anfrage eine eigene DB Verbindung bekommt
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
