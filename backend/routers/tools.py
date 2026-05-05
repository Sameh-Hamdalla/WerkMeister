from typing import List

from fastapi import APIRouter, HTTPException

import crud
import schemas

# Mini-Router fuer alle Werkzeug-Endpunkte. Der Prefix ergibt URLs wie /api/tools/.
router = APIRouter(prefix="/api/tools", tags=["Tools"])


@router.post("/", response_model=schemas.ToolResponse, status_code=201)
def create_tool(tool: schemas.ToolCreate):
    # Pydantic validiert zuerst die Eingabe, CRUD speichert danach in SQLite.
    return crud.create_tool(tool.model_dump())


@router.get("/", response_model=List[schemas.ToolResponse])
def get_tools():
    # Liefert alle Werkzeuge fuer Dashboard, Berichte und Werkzeugliste.
    return crud.get_tools()


@router.get("/{tool_id}", response_model=schemas.ToolResponse)
def get_tool(tool_id: int):
    # Einzelansicht: Wenn die ID fehlt, antwortet die API sauber mit 404.
    tool = crud.get_tool(tool_id)

    if not tool:
        raise HTTPException(status_code=404, detail="Tool nicht gefunden")

    return tool


@router.put("/{tool_id}", response_model=schemas.ToolResponse)
def update_tool(tool_id: int, tool_data: schemas.ToolCreate):
    # PUT ersetzt die editierbaren Felder eines vorhandenen Werkzeugs.
    tool = crud.update_tool(tool_id, tool_data.model_dump())

    if not tool:
        raise HTTPException(status_code=404, detail="Tool nicht gefunden")

    return tool


@router.delete("/{tool_id}", status_code=204)
def delete_tool(tool_id: int):
    # Bei Erfolg wird kein Body zurueckgegeben, nur HTTP 204.
    tool = crud.delete_tool(tool_id)

    if not tool:
        raise HTTPException(status_code=404, detail="Tool nicht gefunden")

    return None
