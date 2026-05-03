import { LayoutDashboard, Wrench, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-header">
        <NavLink className="sidebar-brand" to="/">
          <div className="logo-box">W</div>
          <span className="logo-text">WerkMeister</span>
        </NavLink>
      </div>

      {/* NAV */}
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              end
              to="/"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              to="/werkzeuge"
            >
              <Wrench size={18} />
              <span>Werkzeuge</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              to="/einstellungen"
            >
              <Settings size={18} />
              <span>Einstellungen</span>
            </NavLink>
          </li>
        </ul>
      </nav>

    </aside>
  );
}

export default Sidebar;
