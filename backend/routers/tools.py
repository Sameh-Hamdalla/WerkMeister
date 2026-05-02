from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import crud
import schemas
from database import get_db

# Router erstellen (wie Mini-App)
router = APIRouter(prefix="/api/tools", tags=["Tools"])  # URL prefix  # für Swagger UI


# ➕ Tool erstellen
@router.post("/", response_model=schemas.ToolResponse, status_code=201)
def create_tool(tool: schemas.ToolCreate, db: Session = Depends(get_db)):
    return crud.create_tool(db, tool.dict())


# 📋 Alle Tools
@router.get("/", response_model=List[schemas.ToolResponse])
def get_tools(db: Session = Depends(get_db)):
    return crud.get_tools(db)


# 🔍 Einzelnes Tool
@router.get("/{tool_id}", response_model=schemas.ToolResponse)
def get_tool(tool_id: int, db: Session = Depends(get_db)):
    tool = crud.get_tool(db, tool_id)

    if not tool:
        raise HTTPException(status_code=404, detail="Tool nicht gefunden")

    return tool


# ✏️ Update
@router.put("/{tool_id}", response_model=schemas.ToolResponse)
def update_tool(
    tool_id: int, tool_data: schemas.ToolCreate, db: Session = Depends(get_db)
):
    tool = crud.update_tool(db, tool_id, tool_data.dict())

    if not tool:
        raise HTTPException(status_code=404, detail="Tool nicht gefunden")

    return tool


# ❌ Delete
@router.delete("/{tool_id}", status_code=204)
def delete_tool(tool_id: int, db: Session = Depends(get_db)):
    tool = crud.delete_tool(db, tool_id)

    if not tool:
        raise HTTPException(status_code=404, detail="Tool nicht gefunden")

    return None
