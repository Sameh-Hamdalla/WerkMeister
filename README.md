# 🧰 WerkMeister – Handwerker Tool Management

Eine Fullstack Web-App zur Verwaltung von Werkzeugen für Handwerker.  
Frontend (React + TypeScript) und Backend (FastAPI).

---

## ✨ Features

- 📊 Dashboard Übersicht
- ➕ Werkzeuge hinzufügen
- ✏️ Werkzeuge bearbeiten
- ❌ Werkzeuge löschen
- 🧭 Sidebar Navigation
- 🌙 Dark Mode (optional)
- 🎨 Modernes UI (SaaS Style)

---

## 🏗️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS (Custom UI)

### Backend
- FastAPI
- SQLAlchemy
- SQLite

---

## 📁 Projektstruktur

<img width="267" height="587" alt="image" src="https://github.com/user-attachments/assets/a41d1faa-1cb2-44da-8ea3-b6cd0046bd1e" />

cd backend

# Virtual Environment erstellen
python -m venv venv

# Aktivieren (Windows)
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Dependencies installieren
pip install -r requirements.txt

# Server starten
uvicorn main:app --reload

cd frontend

# Dependencies installieren
npm install

# Dev Server starten
npm run dev
