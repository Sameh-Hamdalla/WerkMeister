import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import Dashboard from "../components/Dashboard";
import ToolForm from "../components/ToolsForm";
import ToolList from "../components/ToolList";

import "./App.css";

type Tool = {
  id: number;
  name: string;
  category: string;
  location: string;
  condition: string;
};

function App() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchToolsData = async (): Promise<Tool[]> => {
    const res = await fetch("http://127.0.0.1:8000/tools/");
    return await res.json();
  };

  const addTool = async () => {
    await fetch("http://127.0.0.1:8000/tools/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, location, condition }),
    });
    fetchToolsData().then(setTools);
  };

  const updateTool = async () => {
    if (!editId) return;

    await fetch(`http://127.0.0.1:8000/tools/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, location, condition }),
    });

    setEditId(null);
    fetchToolsData().then(setTools);
  };

  const deleteTool = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/tools/${id}`, {
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
              <Route path="/" element={<Dashboard toolsCount={tools.length} />} />

              <Route
                path="/werkzeuge"
                element={
                  <>
                    <section className="section">
                      <h3>Werkzeuge verwalten</h3>
                      <ToolForm
                        name={name}
                        category={category}
                        location={location}
                        condition={condition}
                        setName={setName}
                        setCategory={setCategory}
                        setLocation={setLocation}
                        setCondition={setCondition}
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
                  </>
                }
              />

              <Route
                path="/berichte"
                element={
                  <section className="page-card">
                    <p className="page-eyebrow">Berichte</p>
                    <h2>Auswertungen kommen hier hin</h2>
                    <p>
                      Spaeter kannst du hier Wartungen, Kategorien und
                      Werkzeugbewegungen auswerten.
                    </p>
                  </section>
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
