import { LayoutDashboard, Wrench, Settings } from "lucide-react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>WerkMeister</h2>

      <ul>
        <li><LayoutDashboard size={18} /> Dashboard</li>
        <li><Wrench size={18} /> Werkzeuge</li>
        <li><Settings size={18} /> Einstellungen</li>
      </ul>
    </div>
  );
}

export default Sidebar;