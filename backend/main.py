# FastAPI importieren (Framework für API)
from fastapi import FastAPI

# Datenbank-Setup importieren
# engine = Verbindung zur DB
# Base = Grundlage für Tabellen (Models)
# SessionLocal = "Zugriff" auf die DB
from database import engine, Base, SessionLocal

# Tabellen (Modelle) importieren
import models

# FastAPI App starten
app = FastAPI()

# ----------------------------------------
# erstellt automatisch deine Datenbank + Tabellen
# ----------------------------------------
# Base kennt alle Models (z.B. Tool)
# create_all sorgt dafür, dass die Tabellen in der DB erstellt werden
Base.metadata.create_all(bind=engine)


# Funktion um eine DB-Verbindung zu bekommen
def get_db():
    db = SessionLocal()  # neue Verbindung zur DB starten
    try:
        yield db  # gibt die Verbindung zurück (FastAPI nutzt das später)
    finally:
        db.close()  # Verbindung wieder schließen


# 🧪 Test-Route (einfach prüfen ob API läuft)
@app.get("/")  # GET Anfrage an "/" (Startseite)
def root():
    # Gibt eine einfache Nachricht zurück
    return {"msg": "läuft 🚀"}


# ➕ Werkzeug hinzufügen
@app.post("/tools")  # POST Anfrage → Daten werden GESPEICHERT
def add_tool(name: str, category: str, location: str, condition: str):

    # Neue Verbindung zur Datenbank öffnen
    db = SessionLocal()

    # Neues Werkzeug-Objekt erstellen (basierend auf deinem Model)
    # models.Tool ist deine Tabelle (Bauplan)
    new_tool = models.Tool(
        name=name,  # Name des Werkzeugs
        category=category,  # Kategorie (z.B. Elektro, Handwerk)
        location=location,  # Standort (z.B. Lager)
        condition=condition,  # Zustand (z.B. neu, gebraucht)
    )

    # Objekt zur Datenbank "hinzufügen" (noch nicht gespeichert!)
    db.add(new_tool)

    # Änderungen endgültig speichern (sehr wichtig!)
    db.commit()

    # Objekt neu aus der DB laden (z.B. um ID zu bekommen)
    db.refresh(new_tool)

    # Verbindung zur DB schließen (wichtig gegen Fehler)
    db.close()

    # Antwort an den Benutzer
    return {"msg": "Tool gespeichert"}


# 📋 Alle Werkzeuge anzeigen
@app.get("/tools")  # GET Anfrage → Daten werden ABGERUFEN
def get_tools():

    # Verbindung zur Datenbank öffnen
    db = SessionLocal()

    # Alle Einträge aus der Tabelle "Tool" holen
    # query() = Abfrage starten
    # .all() = alle Datensätze holen
    tools = db.query(models.Tool).all()

    # Verbindung schließen
    db.close()

    # Daten zurückgeben (FastAPI wandelt automatisch in JSON um)
    return tools
