import "./ToolsForm.css";
import { Activity, CalendarDays, MapPin, Package, Plus, Save, Tag } from "lucide-react";
import type { FormEvent } from "react";

type Props = {
  name: string;
  category: string;
  location: string;
  condition: string;
  receivedDate: string;
  setName: (v: string) => void;
  setCategory: (v: string) => void;
  setLocation: (v: string) => void;
  setCondition: (v: string) => void;
  setReceivedDate: (v: string) => void;
  onSubmit: () => void;
  isEditing: boolean;
};

function ToolForm({
  name,
  category,
  location,
  condition,
  receivedDate,
  setName,
  setCategory,
  setLocation,
  setCondition,
  setReceivedDate,
  onSubmit,
  isEditing,
}: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form
      className={`tool-form ${isEditing ? "editing" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="tool-form-header">
        <div className="tool-form-icon">
          {isEditing ? <Save size={20} /> : <Plus size={20} />}
        </div>
        <div>
          <h4>{isEditing ? "Werkzeug bearbeiten" : "Neues Werkzeug"}</h4>
          <p>
            {isEditing
              ? "Passe die Details an und speichere die Aenderung."
              : "Erfasse Name, Kategorie, Standort, Zustand und Eingang."}
          </p>
        </div>
      </div>

      <div className="tool-form-grid">
        <label className="tool-field">
          <span>Name</span>
          <div className="tool-input">
            <Package size={17} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z. B. Akkuschrauber"
            />
          </div>
        </label>

        <label className="tool-field">
          <span>Kategorie</span>
          <div className="tool-input">
            <Tag size={17} />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="z. B. Elektrowerkzeug"
            />
          </div>
        </label>

        <label className="tool-field">
          <span>Ort</span>
          <div className="tool-input">
            <MapPin size={17} />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="z. B. Lager A"
            />
          </div>
        </label>

        <label className="tool-field">
          <span>Zustand</span>
          <div className="tool-input">
            <Activity size={17} />
            <input
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="z. B. Gut"
            />
          </div>
        </label>

        <label className="tool-field">
          <span>Eingang</span>
          <div className="tool-input">
            <CalendarDays size={17} />
            <input
              type="date"
              value={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}
            />
          </div>
        </label>
      </div>

      <button className="tool-submit" type="submit">
        {isEditing ? <Save size={18} /> : <Plus size={18} />}
        {isEditing ? "Speichern" : "Hinzufuegen"}
      </button>
    </form>
  );
}

export default ToolForm;
