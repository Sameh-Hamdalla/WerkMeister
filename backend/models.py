# Spalten-Typen importieren
from sqlalchemy import Column, Integer, String

# Base holen (Grundlage für Tabellen)
from database import Base


# Diese Klasse wird zur Tabelle "tools"
class Tool(Base):
    __tablename__ = "tools"

    # eindeutige ID (Primärschlüssel)
    id = Column(Integer, primary_key=True, index=True)

    # Name vom Werkzeug
    name = Column(String(100), nullable=False, index=True)

    # Kategorie (z.B. Bohrer)
    category = Column(String(100), nullable=False, index=True)

    # Ort (z.B. Garage)
    location = Column(String(100), nullable=False)

    # Zustand (z.B. gut, kaputt)
    condition = Column(String(50), nullable=False)
