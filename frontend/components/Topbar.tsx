import "./Topbar.css";

function Topbar() {
  return (
    <div className="topbar">

      {/* 🔹 Linke Seite */}
      <div className="topbar-left">
        <h3>Dashboard</h3>

        {/* optional später: Breadcrumb */}
        <span className="subtitle">Übersicht deiner Werkzeuge</span>
      </div>

      {/* 🔹 Mitte: Suche */}
      <div className="topbar-center">
        <input type="text" placeholder="🔍 Suche..." />
      </div>

      {/* 🔹 Rechte Seite: User */}
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