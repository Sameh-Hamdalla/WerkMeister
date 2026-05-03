import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import Dashboard from "../components/Dashboard";
import LoginPage from "../components/LoginPage";
import ReportsPage from "../components/ReportsPage";
import ToolForm from "../components/ToolsForm";
import ToolList from "../components/ToolList";

import "./App.css";

// Gemeinsamer Datentyp fuer Werkzeugdaten, so wie sie aus der API kommen.
// Die Feldnamen mit Unterstrich passen direkt zum Backend und zur Datenbank.
type Tool = {
  id: number;
  name: string;
  category: string;
  location: string;
  condition: string;
  received_date: string;
  maintenance_date?: string | null;
};

// Zentrale API-Adresse. Alle Werkzeug-Aktionen laufen ueber diese FastAPI-Route.
const API_URL = "http://127.0.0.1:8000/api/tools";

function App() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const formSectionRef = useRef<HTMLElement | null>(null);

  // Hauptdaten der Anwendung. Dashboard, Berichte und Liste lesen alle aus diesem State.
  const [tools, setTools] = useState<Tool[]>([]);

  // Formular-State fuer "Werkzeug hinzufuegen" und "Werkzeug bearbeiten".
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [receivedDate, setReceivedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [maintenanceDate, setMaintenanceDate] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // Laedt Werkzeuge robust aus dem Backend. Bei Fehlern wird eine leere Liste genutzt,
  // damit die UI nicht abstuerzt, wenn der Server kurz nicht erreichbar ist.
  const fetchToolsData = async (): Promise<Tool[]> => {
    try {
      const res = await fetch(`${API_URL}/`);

      if (!res.ok) {
        return [];
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  // Erstellt ein neues Werkzeug in der Datenbank und leert danach das Formular.
  const addTool = async () => {
    const res = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        location,
        condition,
        received_date: receivedDate,
        maintenance_date: maintenanceDate || null,
      }),
    });

    if (!res.ok) {
      return;
    }

    setName("");
    setCategory("");
    setLocation("");
    setCondition("");
    setReceivedDate(new Date().toISOString().slice(0, 10));
    setMaintenanceDate("");
    fetchToolsData().then(setTools);
  };

  // Aktualisiert das Werkzeug, dessen ID vorher ueber startEdit gesetzt wurde.
  const updateTool = async () => {
    if (!editId) return;

    const res = await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        location,
        condition,
        received_date: receivedDate,
        maintenance_date: maintenanceDate || null,
      }),
    });

    if (!res.ok) {
      return;
    }

    setEditId(null);
    setName("");
    setCategory("");
    setLocation("");
    setCondition("");
    setReceivedDate(new Date().toISOString().slice(0, 10));
    setMaintenanceDate("");
    fetchToolsData().then(setTools);
  };

  // Entfernt ein Werkzeug und laedt danach die aktuelle DB-Liste neu.
  const deleteTool = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    fetchToolsData().then(setTools);
  };

  // Scrollt langsam innerhalb des Hauptbereichs zum Formular.
  const scrollToFormSlowly = () => {
    const container = contentRef.current;
    const target = formSectionRef.current;

    if (!container || !target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const startTop = container.scrollTop;
    const targetTop = startTop + targetRect.top - containerRect.top - 18;
    const distance = targetTop - startTop;
    const duration = 950;
    const startTime = performance.now();

    const easeInOut = (progress: number) =>
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      container.scrollTop = startTop + distance * easeInOut(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // Fuellt das Formular mit vorhandenen Daten, damit ein Eintrag bearbeitet werden kann.
  const startEdit = (tool: Tool) => {
    setEditId(tool.id);
    setName(tool.name);
    setCategory(tool.category);
    setLocation(tool.location);
    setCondition(tool.condition);
    setReceivedDate(tool.received_date);
    setMaintenanceDate(tool.maintenance_date ?? "");

    // Nach dem Fuellen der Felder kurz warten, damit React zuerst rendern kann.
    window.setTimeout(scrollToFormSlowly, 80);
  };

  // Beim ersten Laden der App werden die vorhandenen Werkzeuge aus der DB geholt.
  useEffect(() => {
    fetchToolsData().then(setTools);
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <div className="main">
          <Navbar />

          <div className="content" ref={contentRef}>
            {/* React Router entscheidet hier, welche Seite im Hauptbereich angezeigt wird. */}
            <Routes>
              <Route path="/" element={<Dashboard tools={tools} />} />

              <Route
                path="/werkzeuge"
                element={
                  <div className="tools-page">
                    <section className="section" ref={formSectionRef}>
                      <h3>Werkzeuge verwalten</h3>
                      <ToolForm
                        name={name}
                        category={category}
                        location={location}
                        condition={condition}
                        receivedDate={receivedDate}
                        maintenanceDate={maintenanceDate}
                        setName={setName}
                        setCategory={setCategory}
                        setLocation={setLocation}
                        setCondition={setCondition}
                        setReceivedDate={setReceivedDate}
                        setMaintenanceDate={setMaintenanceDate}
                        onSubmit={editId ? updateTool : addTool}
                        isEditing={!!editId}
                      />
                    </section>

                    <section className="section">
                      <h3>Alle Werkzeuge</h3>
                      <ToolList
                        tools={tools}
                        onEdit={startEdit}
                        onDelete={deleteTool}
                      />
                    </section>
                  </div>
                }
              />

              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/berichte"
                element={
                  <ReportsPage tools={tools} />
                }
              />

              <Route
                path="/einstellungen"
                element={
                  <section className="page-card">
                    <p className="page-eyebrow">Einstellungen</p>
                    <h2>App-Konfiguration</h2>
                    <p>
                      Hier ist Platz fuer Benutzerprofil, Standorte und
                      Systemoptionen.
                    </p>
                  </section>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
