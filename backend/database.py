from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite-Datei fuer die Werkzeugdaten. Sie wird automatisch erstellt,
# sobald FastAPI zum ersten Mal startet.
DATABASE_URL = "sqlite:///./tools.db"

# Die Engine ist die zentrale Verbindungsschicht zur Datenbank.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # Notwendig bei SQLite + FastAPI.
)

# Pro Request wird eine eigene Session genutzt. Commit passiert bewusst im CRUD-Code.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Alle SQLAlchemy-Modelle erben von Base, damit Tabellen erzeugt werden koennen.
Base = declarative_base()


def get_db():
    # FastAPI-Dependency: oeffnet eine DB-Session und schliesst sie nach dem Request.
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
