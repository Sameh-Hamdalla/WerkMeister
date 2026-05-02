import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";
import ToolForm from "..//components/ToolsForm";
import ToolList from "..//components/ToolList";

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

  const fetchTools = async () => {
    const res = await fetch("http://127.0.0.1:8000/tools/");
    const data = await res.json();
    setTools(data);
  };

  const addTool = async () => {
    await fetch("http://127.0.0.1:8000/tools/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, location, condition }),
    });
    fetchTools();
  };

  const updateTool = async () => {
    if (!editId) return;
    await fetch(`http://127.0.0.1:8000/tools/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, location, condition }),
    });
    setEditId(null);
    fetchTools();
  };

  const deleteTool = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/tools/${id}`, {
      method: "DELETE",
    });
    fetchTools();
  };

  const startEdit = (tool: Tool) => {
    setEditId(tool.id);
    setName(tool.name);
    setCategory(tool.category);
    setLocation(tool.location);
    setCondition(tool.condition);
  };

  useEffect(() => {
    const loadTools = async () => {
      const res = await fetch("http://127.0.0.1:8000/tools/");
      const data = await res.json();
      setTools(data);
    };

    loadTools();
  }, []);

  return (
    <>
      <Navbar />

      <Dashboard toolsCount={tools.length} />

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

      <ToolList tools={tools} onEdit={startEdit} onDelete={deleteTool} />

      <Footer />
    </>
  );
}

export default App;