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

type Props = {
  toolsCount: number;
};

const recentTools = [
  { name: "Hammer Pro", category: "Handwerkzeug", location: "Lager A" },
  { name: "Bohrer Set", category: "Elektrowerkzeug", location: "Werkstatt" },
  { name: "Schraubendreher", category: "Handwerkzeug", location: "Servicewagen" },
];

function Dashboard({ toolsCount }: Props) {
  const activeTools = Math.round(toolsCount * 0.85);
  const maintenanceDue = toolsCount > 0 ? Math.max(1, Math.round(toolsCount * 0.12)) : 0;
  const categories = toolsCount > 0 ? Math.min(12, Math.max(1, Math.ceil(toolsCount / 2))) : 0;
  const readiness = toolsCount > 0 ? Math.min(98, Math.round((activeTools / toolsCount) * 100)) : 0;

  const stats = [
    {
      label: "Gesamtbestand",
      value: toolsCount,
      hint: "Werkzeuge im System",
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
      hint: "Sortierte Gruppen",
      icon: Package,
      tone: "orange",
    },
    {
      label: "Wartung faellig",
      value: maintenanceDue,
      hint: "Prioritaet pruefen",
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
            Übersicht über Bestand, Verfuegbarkeit und anstehende Wartungen
            deiner Werkzeuge.
          </p>
        </div>

        <div className="hero-metric">
          <span>Bereitschaft</span>
          <strong>{readiness}%</strong>
          <small>{activeTools} von {toolsCount} aktiv</small>
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
              <h3>Wartungsuebersicht</h3>
            </div>
            <Activity size={20} />
          </div>

          <div className="maintenance-list">
            <div className="maintenance-row">
              <span className="maintenance-dot green" />
              <div>
                <strong>Geprueft</strong>
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

          <div className="location-bars">
            <div>
              <span>Lager A</span>
              <strong>46%</strong>
              <div className="bar"><span style={{ width: "46%" }} /></div>
            </div>
            <div>
              <span>Werkstatt</span>
              <strong>34%</strong>
              <div className="bar"><span style={{ width: "34%" }} /></div>
            </div>
            <div>
              <span>Servicewagen</span>
              <strong>20%</strong>
              <div className="bar"><span style={{ width: "20%" }} /></div>
            </div>
          </div>
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

        <div className="tools-grid">
          {recentTools.map((tool) => (
            <article key={tool.name} className="tool-card">
              <div className="tool-card-icon">
                <Wrench size={18} />
              </div>
              <div>
                <h4>{tool.name}</h4>
                <span>{tool.category}</span>
                <p>{tool.location}</p>
              </div>
              <TrendingUp size={17} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
