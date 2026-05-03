import { useEffect, useState } from "react";

// 🔹 Layout Komponenten
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

// 🔹 Content
import Dashboard from "../components/Dashboard";
import ToolForm from "../components/ToolsForm";
import ToolList from "../components/ToolList";

// 🔹 Globales CSS
import "./App.css";


// 🔹 TypeScript Typ für ein Tool
type Tool = {
  id: number;
  name: string;
  category: string;
  location: string;
  condition: string;
};

function App() {

  // ================================
  // 🔹 STATE
  // ================================
  const [tools, setTools] = useState<Tool[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("");
  const [editId, setEditId] = useState<number | null>(null);


  // ================================
  // 🔹 API CALLS
  // ================================
  const fetchToolsData = async (): Promise<Tool[]> => {
    const res = await fetch("http://127.0.0.1:8000/tools/");
    const data = await res.json();
    return data;
  };

  const addTool = async () => {
    await fetch("http://127.0.0.1:8000/tools/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, category, location, condition }),
    });

    fetchToolsData().then(setTools);
  };

  const updateTool = async () => {
    if (!editId) return;

    await fetch(`http://127.0.0.1:8000/tools/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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


  // ================================
  // 🔹 LOAD DATA
  // ================================
  useEffect(() => {
    fetchToolsData().then(setTools);
  }, []);


  // ================================
  // 🔹 UI (ULTRA LAYOUT)
  // ================================
  return (
    <div className="app">
      {/* 🔹 Global Navbar */}
      <Navbar />

      {/* 🔹 Main Area - Full Width */}
      <div className="main">
        <Topbar />

        <div className="content">
          <Dashboard toolsCount={tools.length} />

          <section className="section">
            <h3 style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>Werkzeuge verwalten</h3>
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
            <h3 style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>Alle Werkzeuge</h3>
            <ToolList
              tools={tools}
              onEdit={startEdit}
              onDelete={deleteTool}
            />
          </section>

        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;