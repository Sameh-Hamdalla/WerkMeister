# verbindet sich mit der Datenbank (SQLite Datei)
from sqlalchemy import create_engine

# erstellt Sessions (Verbindung zur DB während einer Anfrage)
from sqlalchemy.orm import sessionmaker, declarative_base

# Pfad zur SQLite Datenbank (Datei wird automatisch erstellt)
DATABASE_URL = "sqlite:///./tools.db"

# Engine = Verbindung zur Datenbank
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}  # wichtig für FastAPI
)

# Session = Zugriff auf DB (z.B. Daten lesen/schreiben)
SessionLocal = sessionmaker(bind=engine)

# Base = Grundlage für alle Tabellen (Models)
Base = declarative_base()


# 🔥 DIESE FUNKTION FEHLT BEI DIR
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
