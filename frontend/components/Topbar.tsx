import "./Topbar.css";

function Topbar() {
  // Optionaler Kopfbereich. Die aktuelle App nutzt Navbar.tsx,
  // aber diese Komponente bleibt als einfache Alternative erhalten.
  return (
    <div className="topbar">
      {/* Linke Seite: Seitentitel und kurzer Kontext. */}
      <div className="topbar-left">
        <h3>Dashboard</h3>

        <span className="subtitle">Uebersicht deiner Werkzeuge</span>
      </div>

      {/* Mitte: Platz fuer eine spaetere Suche. */}
      <div className="topbar-center">
        <input type="text" placeholder="Suche..." />
      </div>

      {/* Rechte Seite: einfacher Benutzerbereich. */}
      <div className="topbar-right">
        <div className="user">
          <div className="avatar">A</div>
          <span>Admin</span>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
