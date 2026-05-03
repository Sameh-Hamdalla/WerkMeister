import { useEffect, useState } from "react";
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

type Tool = {
  id: number;
  name: string;
  category: string;
  location: string;
  condition: string;
  received_date: string;
  maintenance_date?: string | null;
};

const API_URL = "http://127.0.0.1:8000/api/tools";

function App() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [receivedDate, setReceivedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [maintenanceDate, setMaintenanceDate] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

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

  const deleteTool = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    fetchToolsData().then(setTools);
  };

  const startEdit = (tool: Tool) => {
    setEditId(tool.id);
    setName(tool.name);
    setCategory(tool.category);
    setLocation(tool.location);
    setCondition(tool.condition);
    setReceivedDate(tool.received_date);
    setMaintenanceDate(tool.maintenance_date ?? "");
  };

  useEffect(() => {
    fetchToolsData().then(setTools);
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <div className="main">
          <Navbar />

          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard tools={tools} />} />

              <Route
                path="/werkzeuge"
                element={
                  <div className="tools-page">
                    <section className="section">
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
