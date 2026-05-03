from sqlalchemy.orm import Session

import models


def create_tool(db: Session, tool_data: dict):
    # Erstellt aus den validierten API-Daten ein SQLAlchemy-Objekt.
    tool = models.Tool(**tool_data)
    db.add(tool)
    db.commit()
    db.refresh(tool)  # Laedt die von SQLite erzeugte ID in das Objekt.
    return tool


def get_tools(db: Session):
    # Neueste Eintraege stehen zuerst, damit Dashboard und Liste aktuell wirken.
    return db.query(models.Tool).order_by(models.Tool.id.desc()).all()


def get_tool(db: Session, tool_id: int):
    # Sucht genau ein Werkzeug per Primaerschluessel.
    return db.query(models.Tool).filter(models.Tool.id == tool_id).first()


def update_tool(db: Session, tool_id: int, data: dict):
    # Erst laden, dann alle uebergebenen Felder auf dem bestehenden Datensatz setzen.
    tool = get_tool(db, tool_id)

    if not tool:
        return None

    for key, value in data.items():
        setattr(tool, key, value)

    db.commit()
    db.refresh(tool)
    return tool


def delete_tool(db: Session, tool_id: int):
    # Gibt None zurueck, wenn die ID nicht existiert. Der Router macht daraus 404.
    tool = get_tool(db, tool_id)

    if not tool:
        return None

    db.delete(tool)
    db.commit()
    return tool
