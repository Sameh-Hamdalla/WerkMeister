import "./ToolList.css";
import { CalendarDays, MapPin, Pencil, Tag, Trash2, Wrench } from "lucide-react";

type Tool = {
  id: number;
  name: string;
  category: string;
  location: string;
  condition: string;
  received_date: string;
};

type Props = {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
  onDelete: (id: number) => void;
};

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

function ToolList({ tools, onEdit, onDelete }: Props) {
  if (tools.length === 0) {
    return (
      <div className="tool-empty">
        <div className="tool-empty-icon">
          <Wrench size={24} />
        </div>
        <div>
          <h4>Noch keine Werkzeuge</h4>
          <p>Fuege dein erstes Werkzeug hinzu, um dein Inventar zu starten.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-list">
      {tools.map((tool) => (
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
              <Pencil size={17} />
            </button>

            <button
              className="tool-action delete"
              onClick={() => onDelete(tool.id)}
              aria-label={`${tool.name} loeschen`}
              title="Loeschen"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToolList;
