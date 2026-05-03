from typing import Optional

from pydantic import BaseModel, Field


class ToolCreate(BaseModel):
    # Daten, die vom Frontend bei POST und PUT gesendet werden.
    # Field prueft Mindestlaengen, bevor die Daten in der DB landen.
    name: str = Field(..., min_length=2)
    category: str = Field(..., min_length=2)
    location: str = Field(..., min_length=2)
    condition: str = Field(..., min_length=2)
    received_date: str = Field(..., min_length=10, max_length=10)
    maintenance_date: Optional[str] = Field(None, min_length=10, max_length=10)


class ToolResponse(ToolCreate):
    # Antwortmodell: gleiche Felder wie ToolCreate, aber mit Datenbank-ID.
    id: int

    # Erlaubt Pydantic, direkt aus SQLAlchemy-Objekten eine Response zu bauen.
    model_config = {"from_attributes": True}
