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
    <ul>
      {tools.map((tool) => (
        <li key={tool.id}>
          {tool.name} - {tool.category} - {tool.location} - {tool.condition}

          <button onClick={() => onEdit(tool)}>Bearbeiten</button>
          <button onClick={() => onDelete(tool.id)}>Löschen</button>
        </li>
      ))}
    </ul>
  );
}

export default ToolList;