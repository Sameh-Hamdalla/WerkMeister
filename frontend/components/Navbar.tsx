import { Bell } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <div style={{width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent), #3b82f6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          W
        </div>
        <h2>WerkMeister</h2>
      </div>

      {/* Navigation */}
      <ul className="navbar-nav">
        <li className="active">Dashboard</li>
        <li>Werkzeuge</li>
        <li>Berichte</li>
        <li>Einstellungen</li>
      </ul>

      {/* Actions */}
      <div className="navbar-actions">
        <button className="btn-outline" title="Benachrichtigungen">
          <Bell size={20} />
        </button>
        <div className="avatar" style={{width: '36px', height: '36px'}} title="Profil">
          A
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

