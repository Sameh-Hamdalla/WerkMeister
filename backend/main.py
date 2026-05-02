# FastAPI = Framework für Backend
# Depends = wird benutzt, um z.B. die Datenbank-Verbindung automatisch zu bekommen
# HTTPException = damit wir saubere Fehlermeldungen zurückgeben können
from fastapi import FastAPI, Depends, HTTPException

# Session = eine aktive Verbindung zur Datenbank
from sqlalchemy.orm import Session

# List = damit FastAPI weiß: hier kommt eine Liste zurück
from typing import List

# unsere eigenen Dateien importieren
import models
from database import engine, get_db

# BaseModel = Grundlage für Daten, die über die API reinkommen oder rausgehen
from pydantic import BaseModel

# Erstellt automatisch alle Tabellen in der Datenbank,
# wenn sie noch nicht existieren
models.Base.metadata.create_all(bind=engine)


# FastAPI App erstellen
app = FastAPI()


# -----------------------
# Pydantic Models
# -----------------------


# „Wenn jemand ein Werkzeug einträgt, muss er mir sagen:“
# Dieses Model beschreibt, welche Daten beim Erstellen
# oder Bearbeiten eines Werkzeugs gesendet werden müssen
class ToolCreate(BaseModel):
    name: str  # Name vom Werkzeug
    category: str  # Kategorie, z.B. Handwerkzeug
    location: str  # Standort, z.B. Garage
    condition: str  # Zustand, z.B. gut, defekt


# „Wenn ich ein Werkzeug zurückgebe, bekommt es zusätzlich eine ID“


# Dieses Model beschreibt, welche Daten die API zurückgibt
# Es erbt alle Felder von ToolCreate und ergänzt die id
class ToolResponse(ToolCreate):
    id: int  # ID kommt aus der Datenbank

    class Config:
        # Für Pydantic v1: „Pydantic darf auch mit Datenbank-Objekten (ORM-Objekten) arbeiten“
        orm_mode = True

        # Falls du Pydantic v2 nutzt, besser:
        # from_attributes = True


# -----------------------
# CRUD Endpoints
# -----------------------


# Neues Werkzeug erstellen
@app.post("/tools/", response_model=ToolResponse)
def create_tool(tool: ToolCreate, db: Session = Depends(get_db)):
    # Aus den gesendeten Daten wird ein Datenbank-Objekt erstellt
    db_tool = models.Tool(**tool.dict())

    # Werkzeug zur Datenbank hinzufügen
    db.add(db_tool)

    # Änderung speichern
    db.commit()

    # Objekt aktualisieren, damit z.B. die neue ID verfügbar ist
    db.refresh(db_tool)

    # gespeichertes Werkzeug zurückgeben
    return db_tool


# Alle Werkzeuge anzeigen
@app.get("/tools/", response_model=List[ToolResponse])
def get_tools(db: Session = Depends(get_db)):
    # Alle Einträge aus der Tabelle tools holen
    return db.query(models.Tool).all()


# Ein einzelnes Werkzeug anhand der ID anzeigen
@app.get("/tools/{tool_id}", response_model=ToolResponse)
def get_tool(tool_id: int, db: Session = Depends(get_db)):
    # Werkzeug mit passender ID suchen
    tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()

    # Falls kein Werkzeug gefunden wurde
    if not tool:
        raise HTTPException(status_code=404, detail="Tool nicht gefunden")

    # gefundenes Werkzeug zurückgeben
    return tool


# Werkzeug bearbeiten
@app.put("/tools/{tool_id}", response_model=ToolResponse)
def update_tool(tool_id: int, updated_tool: ToolCreate, db: Session = Depends(get_db)):
    # Werkzeug mit passender ID suchen
    tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()

    # Falls kein Werkzeug gefunden wurde
    if not tool:
        raise HTTPException(status_code=404, detail="Tool nicht gefunden")

    # Alle neuen Werte übernehmen
    for key, value in updated_tool.dict().items():
        setattr(tool, key, value)

    # Änderungen speichern
    db.commit()

    # aktualisiertes Werkzeug neu laden
    db.refresh(tool)

    # bearbeitetes Werkzeug zurückgeben
    return tool


# Werkzeug löschen
@app.delete("/tools/{tool_id}")
def delete_tool(tool_id: int, db: Session = Depends(get_db)):
    # Werkzeug mit passender ID suchen
    tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()

    # Falls kein Werkzeug gefunden wurde
    if not tool:
        raise HTTPException(status_code=404, detail="Tool nicht gefunden")

    # Werkzeug löschen
    db.delete(tool)

    # Löschung speichern
    db.commit()

    # Bestätigung zurückgeben
    return {"message": "Tool gelöscht"}
