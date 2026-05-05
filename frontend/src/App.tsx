import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Search, X } from "lucide-react";

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

// Zentrale API-Adresse. Lokal nutzt die App FastAPI auf Port 8000,
// auf Render kommt die URL aus der Environment-Variable VITE_API_URL.
const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/tools"
).replace(/\/$/, "");
type SortOption =
  | "newest"
  | "name"
  | "category"
  | "location"
  | "condition"
  | "received"
  | "maintenance";

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
  const [toolSearch, setToolSearch] = useState("");
  const [toolSort, setToolSort] = useState<SortOption>("newest");

  // Gefilterte und sortierte Liste fuer die Werkzeugseite. Suche/Sortierung laufen
  // nur im Frontend und veraendern die gespeicherten Daten nicht.
  const filteredTools = useMemo(() => {
    const query = toolSearch.trim().toLowerCase();
    const searchedTools = query
      ? tools.filter((tool) =>
          [
            tool.name,
            tool.category,
            tool.location,
            tool.condition,
            tool.received_date,
            tool.maintenance_date ?? "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
      : tools;

    return [...searchedTools].sort((first, second) => {
      if (toolSort === "name") {
        return first.name.localeCompare(second.name, "de");
      }

      if (toolSort === "category") {
        return first.category.localeCompare(second.category, "de");
      }

      if (toolSort === "location") {
        return first.location.localeCompare(second.location, "de");
      }

      if (toolSort === "condition") {
        return first.condition.localeCompare(second.condition, "de");
      }

      if (toolSort === "received") {
        return second.received_date.localeCompare(first.received_date);
      }

      if (toolSort === "maintenance") {
        return (first.maintenance_date ?? "9999-12-31").localeCompare(
          second.maintenance_date ?? "9999-12-31"
        );
      }

      return second.id - first.id;
    });
  }, [toolSearch, toolSort, tools]);

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
                      <div className="section-toolbar">
                        <div>
                          <h3>Alle Werkzeuge</h3>
                          <p>
                            {filteredTools.length} von {tools.length} Eintraegen
                            sichtbar
                          </p>
                        </div>

                        <div className="tool-list-controls">
                          <label className="tool-search">
                            <Search size={17} />
                            <input
                              type="search"
                              value={toolSearch}
                              onChange={(event) =>
                                setToolSearch(event.target.value)
                              }
                              placeholder="Werkzeug suchen..."
                            />
                            {toolSearch && (
                              <button
                                type="button"
                                onClick={() => setToolSearch("")}
                                aria-label="Suche leeren"
                                title="Suche leeren"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </label>

                          <label className="tool-sort">
                            <span>Sortieren</span>
                            <select
                              value={toolSort}
                              onChange={(event) =>
                                setToolSort(event.target.value as SortOption)
                              }
                            >
                              <option value="newest">Neueste zuerst</option>
                              <option value="name">Name A-Z</option>
                              <option value="category">Kategorie A-Z</option>
                              <option value="location">Ort A-Z</option>
                              <option value="condition">Zustand A-Z</option>
                              <option value="received">Eingang neueste</option>
                              <option value="maintenance">
                                Wartung naechste
                              </option>
                            </select>
                          </label>
                        </div>
                      </div>

                      <ToolList
                        tools={filteredTools}
                        onEdit={startEdit}
                        onDelete={deleteTool}
                        isSearching={toolSearch.trim().length > 0}
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
