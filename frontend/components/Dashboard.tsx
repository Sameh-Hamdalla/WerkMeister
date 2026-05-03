import "./Dashboard.css";
import { Wrench, Package, Activity, TrendingUp } from "lucide-react";

type Props = {
  toolsCount: number;
};

type DummyTool = {
  name: string;
  category: string;
};

const dummyRecentTools: DummyTool[] = [
  { name: "Hammer Pro", category: "Handwerkzeug" },
  { name: "Bohrer Set", category: "Elektrowerkzeug" },
  { name: "Schraubendreher", category: "Handwerkzeug" },
];

function Dashboard({ toolsCount }: Props) {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* Stats Cards */}
      <div className="cards">
        <div className="card">
          <div className="card-icon">
            <Wrench />
          </div>
          <p>Gesamt Werkzeuge</p>
          <h3>{toolsCount}</h3>
        </div>

        <div className="card">
          <div className="card-icon" style={{background: 'linear-gradient(135deg, #10b981, #34d399)'}}>
            <Activity />
          </div>
          <p>Aktiv</p>
          <h3>{Math.round(toolsCount * 0.85)}</h3>
        </div>

        <div className="card">
          <div className="card-icon" style={{background: 'linear-gradient(135deg, #f59e0b, #fbbf24)'}}>
            <Package />
          </div>
          <p>Kategorien</p>
          <h3>12</h3>
        </div>

        <div className="card">
          <div className="card-icon" style={{background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'}}>
            <TrendingUp />
          </div>
          <p>Wartung fällig</p>
          <h3>3</h3>
        </div>
      </div>

      {/* Recent Tools */}
      <div className="card" style={{marginTop: '2rem'}}>
        <h3 style={{marginBottom: '1rem'}}>Letzte Werkzeuge</h3>
        <div className="flex" style={{gap: '1rem'}}>
          {dummyRecentTools.map((tool, i) => (
            <div key={i} className="card" style={{flex: '1', padding: '1.5rem'}}>
              <h4>{tool.name}</h4>
              <p>{tool.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

