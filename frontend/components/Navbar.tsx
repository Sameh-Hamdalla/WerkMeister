import { Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Werkzeuge", to: "/werkzeuge" },
  { label: "Berichte", to: "/berichte" },
  { label: "Einstellungen", to: "/einstellungen" },
];

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink className="navbar-brand" to="/" aria-label="Zur Dashboard-Seite">
          <div className="logo-box">W</div>
          <h1 className="logo-text">WerkMeister</h1>
        </NavLink>
      </div>

      <ul className="navbar-nav">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              end={item.to === "/"}
              to={item.to}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        <button className="icon-btn" type="button" aria-label="Benachrichtigungen">
          <Bell size={18} />
        </button>

        <NavLink className="avatar" to="/login" aria-label="Login oeffnen">
          A
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
