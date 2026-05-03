# Pydantic für Datenvalidierung
from pydantic import BaseModel, Field


# Daten die vom Frontend kommen (POST / PUT)
class ToolCreate(BaseModel):
    name: str = Field(..., min_length=2)
    category: str = Field(..., min_length=2)
    location: str = Field(..., min_length=2)
    condition: str = Field(..., min_length=2)
    received_date: str = Field(..., min_length=10, max_length=10)


# Daten die zurückgegeben werden (inkl. ID)
class ToolResponse(ToolCreate):
    id: int

    model_config = {"from_attributes": True}
