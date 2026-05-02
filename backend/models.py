# Spalten-Typen importieren
from sqlalchemy import Column, Integer, String

# Base aus database.py holen
from database import Base


# Klasse = Tabelle in der Datenbank
class Tool(Base):
    __tablename__ = "tools"  # Name der Tabelle

    id = Column(Integer, primary_key=True, index=True)  # eindeutige ID
    name = Column(String)  # Name vom Werkzeug
    category = Column(String)  # Kategorie
    location = Column(String)  # Ort
    condition = Column(String)  # Zustand
