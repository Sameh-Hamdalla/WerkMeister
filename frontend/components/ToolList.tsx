import "./ToolList.css";
type Tool = {
  id: number;
  name: string;
  category: string;
  location: string;
  condition: string;
};

type Props = {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
  onDelete: (id: number) => void;
};

function ToolList({ tools, onEdit, onDelete }: Props) {
  return (
    <ul className="list">
      {tools.map((tool) => (
        <li key={tool.id} className="item card">
          <div className="tool-info">
            <h4>{tool.name}</h4>
            <div className="badges">
              <span className="badge">{tool.category}</span>
              <span className="badge">{tool.location}</span>
              <span className={`badge condition-${tool.condition.toLowerCase().includes('gut') ? 'good' : 'poor'}`}>
                {tool.condition}
              </span>
            </div>
          </div>
          <div className="actions">
            <button className="edit" onClick={() => onEdit(tool)}>
              Bearbeiten
            </button>
            <button className="delete" onClick={() => onDelete(tool.id)}>
              Löschen
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ToolList;