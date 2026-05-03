from datetime import date

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

import models
from database import engine
from routers import tools

# Erstellt Tabellen, falls die SQLite-Datei noch leer ist.
models.Base.metadata.create_all(bind=engine)


def migrate_tools_table():
    # Kleine Migration fuer bestehende Datenbanken: Wenn alte DB-Dateien
    # die neuen Datumsspalten noch nicht haben, werden sie automatisch ergaenzt.
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

    if "maintenance_date" not in columns:
        with engine.begin() as connection:
            connection.execute(
                text("ALTER TABLE tools ADD COLUMN maintenance_date VARCHAR(10)")
            )


migrate_tools_table()

# FastAPI-App mit Titel fuer Swagger UI (/docs).
app = FastAPI(title="WerkMeister API")

# In der Entwicklung sind alle Origins erlaubt. Fuer Produktion besser einschraenken.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bindet die Werkzeug-Routen in die App ein.
app.include_router(tools.router)
