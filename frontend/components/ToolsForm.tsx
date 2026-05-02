type Props = {
  name: string;
  category: string;
  location: string;
  condition: string;
  setName: (v: string) => void;
  setCategory: (v: string) => void;
  setLocation: (v: string) => void;
  setCondition: (v: string) => void;
  onSubmit: () => void;
  isEditing: boolean;
};

function ToolForm({
  name,
  category,
  location,
  condition,
  setName,
  setCategory,
  setLocation,
  setCondition,
  onSubmit,
  isEditing,
}: Props) {
  return (
    <div className="form">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategorie" />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ort" />
      <input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Zustand" />

      <button onClick={onSubmit}>
        {isEditing ? "Speichern" : "Hinzufügen"}
      </button>
    </div>
  );
}

export default ToolForm;