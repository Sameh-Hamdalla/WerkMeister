import "./Dashboard.css";
import {
  Activity,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Package,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from "lucide-react";

// Dashboard bekommt die Daten aus App.tsx. Es nutzt keine Demo-Daten,
// sondern berechnet alle Kennzahlen aus dieser Werkzeugliste.
type Tool = {
  id: number;
  name: string;
  category: string;
  location: string;
  condition: string;
  received_date: string;
  maintenance_date?: string | null;
};

type Props = {
  tools: Tool[];
};

// Kleine Hilfsfunktion, damit Vergleiche nicht an Gross-/Kleinschreibung scheitern.
const normalize = (value: string) => value.trim().toLowerCase();

// Entscheidet anhand des Zustandstextes, ob ein Werkzeug im Wartungsbereich landet.
const isMaintenanceCondition = (condition: string) => {
  const value = normalize(condition);

  return (
    value.includes("wart") ||
    value.includes("defekt") ||
    value.includes("kaputt") ||
    value.includes("schlecht") ||
    value.includes("repar") ||
    value.includes("mittel")
  );
};

function Dashboard({ tools }: Props) {
  // Grundkennzahlen fuer die Karten im oberen Dashboard-Bereich.
  const toolsCount = tools.length;
  const maintenanceTools = tools.filter((tool) =>
    isMaintenanceCondition(tool.condition)
  );
  const maintenanceDue = maintenanceTools.length;
  const activeTools = toolsCount - maintenanceDue;
  const readiness =
    toolsCount > 0 ? Math.round((activeTools / toolsCount) * 100) : 0;

  // Anzahl unterschiedlicher Kategorien. Leere Werte werden ignoriert.
  const categories = new Set(
    tools.map((tool) => normalize(tool.category)).filter(Boolean)
  ).size;

  // Zaehlt Werkzeuge pro Standort fuer die Balkenansicht.
  const locationCounts = tools.reduce<Record<string, number>>((result, tool) => {
    const location = tool.location.trim() || "Ohne Standort";
    result[location] = (result[location] ?? 0) + 1;
    return result;
  }, {});

  const topLocations = Object.entries(locationCounts)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 3);

  // Neueste Werkzeuge werden nach Eingangsdatum und danach nach ID sortiert.
  const recentTools = [...tools]
    .sort((first, second) => {
      const dateCompare = second.received_date.localeCompare(first.received_date);

      if (dateCompare !== 0) {
        return dateCompare;
      }

      return second.id - first.id;
    })
    .slice(0, 3);
  const latestReceivedDate = tools
    .map((tool) => tool.received_date)
    .filter(Boolean)
    .sort()
    .at(-1);

  // Diese Struktur macht das Rendern der Statistik-Karten kurz und wiederverwendbar.
  const stats = [
    {
      label: "Gesamtbestand",
      value: toolsCount,
      hint: latestReceivedDate ? `Letzter Eingang: ${latestReceivedDate}` : "Werkzeuge im System",
      icon: Wrench,
      tone: "blue",
    },
    {
      label: "Einsatzbereit",
      value: activeTools,
      hint: `${readiness}% Verfuegbarkeit`,
      icon: CheckCircle2,
      tone: "green",
    },
    {
      label: "Kategorien",
      value: categories,
      hint: "Aus deinen Werkzeugdaten",
      icon: Package,
      tone: "orange",
    },
    {
      label: "Wartung fällig",
      value: maintenanceDue,
      hint: "Nach Zustand berechnet",
      icon: CalendarClock,
      tone: "red",
    },
  ];

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-eyebrow">
            <ShieldCheck size={15} />
            Werkstatt Cockpit
          </span>
          <h2>Alles im Blick, bevor der Tag loslegt.</h2>
          <p>
            Die Statistik wird automatisch aus deinen erfassten Werkzeugen,
            Kategorien, Standorten und Zustaenden berechnet.
          </p>
        </div>

        <div className="hero-metric">
          <span>Bereitschaft</span>
          <strong>{readiness}%</strong>
          <small>
            {activeTools} von {toolsCount} aktiv
          </small>
        </div>
      </section>

      <section className="stats-grid" aria-label="Werkzeug Kennzahlen">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.label} className="stat-card">
              <div className={`stat-icon ${stat.tone}`}>
                <Icon size={22} />
              </div>
              <div className="stat-content">
                <p>{stat.label}</p>
                <h3>{stat.value}</h3>
                <span>{stat.hint}</span>
              </div>
              <ArrowUpRight className="stat-arrow" size={18} />
            </article>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Status</span>
              <h3>Wartungsübersicht</h3>
            </div>
            <Activity size={20} />
          </div>

          <div className="maintenance-list">
            <div className="maintenance-row">
              <span className="maintenance-dot green" />
              <div>
                <strong>Geprüft</strong>
                <p>{activeTools} Werkzeuge einsatzbereit</p>
              </div>
            </div>
            <div className="maintenance-row">
              <span className="maintenance-dot orange" />
              <div>
                <strong>Wartung planen</strong>
                <p>{maintenanceDue} Werkzeuge im Blick behalten</p>
              </div>
            </div>
            <div className="maintenance-row">
              <span className="maintenance-dot blue" />
              <div>
                <strong>Inventur</strong>
                <p>{categories} Kategorien aktuell gepflegt</p>
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">Standorte</span>
              <h3>Verteilung</h3>
            </div>
            <MapPin size={20} />
          </div>

          {topLocations.length > 0 ? (
            <div className="location-bars">
              {topLocations.map(([location, count]) => {
                const percent = Math.round((count / toolsCount) * 100);

                return (
                  <div key={location}>
                    <span>{location}</span>
                    <strong>{percent}%</strong>
                    <div className="bar">
                      <span style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="dashboard-empty">Noch keine Standortdaten vorhanden.</p>
          )}
        </article>
      </section>

      <section className="recent-section">
        <div className="section-header">
          <div>
            <span className="panel-kicker">Zuletzt erfasst</span>
            <h3>Letzte Werkzeuge</h3>
          </div>
          <ClipboardList size={20} />
        </div>

        {recentTools.length > 0 ? (
          <div className="tools-grid">
            {recentTools.map((tool) => (
              <article key={tool.id} className="tool-card">
                <div className="tool-card-icon">
                  <Wrench size={18} />
                </div>
                <div>
                  <h4>{tool.name}</h4>
                  <span>{tool.category}</span>
                  <p>{tool.location} · Eingang {tool.received_date}</p>
                </div>
                <TrendingUp size={17} />
              </article>
            ))}
          </div>
        ) : (
          <p className="dashboard-empty">
            Erfasse dein erstes Werkzeug, dann erscheinen hier die neuesten
            Eintraege.
          </p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
