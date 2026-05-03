from fastapi import FastAPI
from datetime import date
from sqlalchemy import inspect, text

# CORS (für React wichtig!)
from fastapi.middleware.cors import CORSMiddleware

# DB Setup
import models
from database import engine

# Router importieren
from routers import tools

# Tabellen erstellen
models.Base.metadata.create_all(bind=engine)


def migrate_tools_table():
    inspector = inspect(engine)

    if "tools" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("tools")}

    if "received_date" not in columns:
        today = date.today().isoformat()

        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE tools "
                    f"ADD COLUMN received_date VARCHAR(10) NOT NULL DEFAULT '{today}'"
                )
            )


migrate_tools_table()

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
