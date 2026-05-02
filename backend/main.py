from fastapi import FastAPI

# CORS (für React wichtig!)
from fastapi.middleware.cors import CORSMiddleware

# DB Setup
import models
from database import engine

# Router importieren
from routers import tools

# Tabellen erstellen
models.Base.metadata.create_all(bind=engine)

# App erstellen
app = FastAPI(title="WerkMeister API")

# CORS aktivieren
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # später einschränken!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router einbinden
app.include_router(tools.router)
