import { Bell, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Werkzeuge", to: "/werkzeuge" },
  { label: "Berichte", to: "/berichte" },
  { label: "Einstellungen", to: "/einstellungen" },
];

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink className="navbar-brand" to="/" aria-label="Zur Dashboard-Seite">
          <div className="logo-box">W</div>
          <h1 className="navbar-logo-text">WerkMeister</h1>
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

        <button
          className={`avatar ${isLoginOpen ? "active" : ""}`}
          type="button"
          aria-expanded={isLoginOpen}
          aria-label="Login ein- oder ausblenden"
          onClick={() => setIsLoginOpen((current) => !current)}
        >
          A
        </button>

        {isLoginOpen && (
          <div className="navbar-login" role="dialog" aria-label="Zugangsdaten">
            <div className="navbar-login-header">
              <strong>Zugangsdaten</strong>
              <span>WerkMeister Login</span>
            </div>

            <form className="navbar-login-form" onSubmit={handleLoginSubmit}>
              <label>
                <span>E-Mail</span>
                <div className="navbar-login-input">
                  <Mail size={15} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@firma.de"
                  />
                </div>
              </label>

              <label>
                <span>Passwort</span>
                <div className="navbar-login-input">
                  <Lock size={15} />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Passwort"
                  />
                </div>
              </label>

              <button className="navbar-login-submit" type="submit">
                <LogIn size={16} />
                Einloggen
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
