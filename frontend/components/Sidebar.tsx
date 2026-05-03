import { FileText, LayoutDashboard, LogIn, Settings, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Seitenleiste fuer groessere Bildschirme. Auf kleinen Screens uebernimmt die Navbar. */}
      <div className="sidebar-header">
        <NavLink className="sidebar-brand" to="/">
          <div className="logo-box">W</div>
          <span className="logo-text">WerkMeister</span>
        </NavLink>
      </div>

      {/* NavLink markiert den aktiven Menuepunkt automatisch mit der Klasse "active". */}
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
              to="/berichte"
            >
              <FileText size={18} />
              <span>Berichte</span>
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

          <li>
            <NavLink
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              to="/login"
            >
              <LogIn size={18} />
              <span>Login</span>
            </NavLink>
          </li>
        </ul>
      </nav>

    </aside>
  );
}

export default Sidebar;
