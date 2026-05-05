from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers import tools

# Erstellt Tabellen, falls die SQLite-Datei noch leer ist.
init_db()

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


@app.get("/health")
def health_check():
    return {"status": "ok"}
