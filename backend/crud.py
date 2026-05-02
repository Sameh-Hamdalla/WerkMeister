# Session für DB Zugriff
from sqlalchemy.orm import Session

# unsere Tabelle
import models


# ➕ Tool erstellen
def create_tool(db: Session, tool_data: dict):
    tool = models.Tool(**tool_data)  # dict → DB Objekt
    db.add(tool)
    db.commit()
    db.refresh(tool)  # lädt neue ID
    return tool


# 📋 Alle Tools holen
def get_tools(db: Session):
    return db.query(models.Tool).all()


# 🔍 Einzelnes Tool
def get_tool(db: Session, tool_id: int):
    return db.query(models.Tool).filter(models.Tool.id == tool_id).first()


# ✏️ Tool updaten
def update_tool(db: Session, tool_id: int, data: dict):
    tool = get_tool(db, tool_id)

    if not tool:
        return None

    for key, value in data.items():
        setattr(tool, key, value)

    db.commit()
    db.refresh(tool)
    return tool


# ❌ Tool löschen
def delete_tool(db: Session, tool_id: int):
    tool = get_tool(db, tool_id)

    if not tool:
        return None

    db.delete(tool)
    db.commit()
    return tool
