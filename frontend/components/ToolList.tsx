import "./ToolList.css";
import { CalendarDays, MapPin, Pencil, Tag, Trash2, Wrench } from "lucide-react";

// Werkzeugdaten kommen von App.tsx, nachdem sie aus dem Backend geladen wurden.
type Tool = {
  id: number;
  name: string;
  category: string;
  location: string;
  condition: string;
  received_date: string;
  maintenance_date?: string | null;
};

type Props = {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
  onDelete: (id: number) => void;
  isSearching?: boolean;
};

// Wandelt freie Zustandstexte in CSS-Klassen um, damit die Badge-Farbe passt.
const getConditionClass = (condition: string) => {
  const normalized = condition.toLowerCase();

  if (normalized.includes("gut") || normalized.includes("neu")) {
    return "good";
  }

  if (normalized.includes("wart") || normalized.includes("mittel")) {
    return "warning";
  }

  return "poor";
};

function ToolList({ tools, onEdit, onDelete, isSearching = false }: Props) {
  // Freundlicher Leerzustand: ohne Suche bedeutet es "keine Daten",
  // mit Suche bedeutet es "keine passenden Treffer".
  if (tools.length === 0) {
    return (
      <div className="tool-empty">
        <div className="tool-empty-icon">
          <Wrench size={24} />
        </div>
        <div>
          <h4>{isSearching ? "Keine Treffer gefunden" : "Noch keine Werkzeuge"}</h4>
          <p>
            {isSearching
              ? "Passe deine Suche an oder leere das Suchfeld."
              : "Fuege dein erstes Werkzeug hinzu, um dein Inventar zu starten."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-list">
      {tools.map((tool) => (
        // Jede Karte steht fuer einen Datensatz aus der tools-Tabelle.
        <div key={tool.id} className="tool-item">
          <div className="tool-avatar" aria-hidden="true">
            {tool.name.charAt(0).toUpperCase()}
          </div>

          <div className="tool-main">
            <h4>{tool.name}</h4>

            <div className="badges">
              <span className="badge">
                <Tag size={13} />
                {tool.category}
              </span>
              <span className="badge">
                <MapPin size={13} />
                {tool.location}
              </span>
              <span className="badge">
                <CalendarDays size={13} />
                {tool.received_date}
              </span>
              {tool.maintenance_date && (
                <span className="badge maintenance-date">
                  <CalendarDays size={13} />
                  Wartung {tool.maintenance_date}
                </span>
              )}

              <span
                className={`badge condition ${getConditionClass(
                  tool.condition
                )}`}
              >
                {tool.condition}
              </span>
            </div>
          </div>

          <div className="actions">
            <button
              className="tool-action edit"
              onClick={() => onEdit(tool)}
              aria-label={`${tool.name} bearbeiten`}
              title="Bearbeiten"
            >
              {/* Bearbeiten fuellt das Formular mit genau diesem Werkzeug. */}
              <Pencil size={17} />
            </button>

            <button
              className="tool-action delete"
              onClick={() => onDelete(tool.id)}
              aria-label={`${tool.name} loeschen`}
              title="Loeschen"
            >
              {/* Loeschen ruft die DELETE-Route im Backend auf. */}
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToolList;
