import "./ReportsPage.css";
import {
  CalendarDays,
  ClipboardList,
  Download,
  MapPin,
  Package,
  Printer,
  ShieldAlert,
  Tags,
} from "lucide-react";
import { useMemo, useState } from "react";

// Gleicher Werkzeugtyp wie in App.tsx. Die Berichte lesen nur diese Daten
// und erzeugen daraus Tabellen, CSV-Dateien oder druckbare PDF-Ansichten.
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

// Erlaubte Berichtstypen. Dadurch kann TypeScript Tippfehler bei IDs erkennen.
type ReportType = "inventory" | "maintenance" | "locations" | "categories" | "incoming";
type ReportRow = Record<string, string | number>;

// Konfiguration der Berichtskarten: Text, Beschreibung und Icon kommen von hier.
const reportOptions = [
  {
    id: "inventory",
    title: "Bestandsbericht",
    description: "Alle erfassten Werkzeuge mit Stammdaten.",
    icon: ClipboardList,
  },
  {
    id: "maintenance",
    title: "Wartungsbericht",
    description: "Werkzeuge mit Wartungstermin oder auffaelligem Zustand.",
    icon: ShieldAlert,
  },
  {
    id: "locations",
    title: "Standortbericht",
    description: "Verteilung der Werkzeuge nach Standort.",
    icon: MapPin,
  },
  {
    id: "categories",
    title: "Kategoriebericht",
    description: "Anzahl der Werkzeuge je Kategorie.",
    icon: Tags,
  },
  {
    id: "incoming",
    title: "Eingangsbericht",
    description: "Werkzeuge sortiert nach Eingangsdatum.",
    icon: CalendarDays,
  },
] satisfies Array<{
  id: ReportType;
  title: string;
  description: string;
  icon: typeof Package;
}>;

// Zustandstexte werden bewusst flexibel erkannt, weil Benutzer freie Texte eingeben.
const isMaintenanceCondition = (condition: string) => {
  const value = condition.trim().toLowerCase();

  return (
    value.includes("wart") ||
    value.includes("defekt") ||
    value.includes("kaputt") ||
    value.includes("schlecht") ||
    value.includes("repar") ||
    value.includes("mittel")
  );
};

// Ein Werkzeug erscheint im Wartungsbericht, wenn ein Termin gesetzt ist
// oder der Zustand auf Wartung/Reparatur hinweist.
const hasMaintenanceReportEntry = (tool: Tool) =>
  Boolean(tool.maintenance_date) || isMaintenanceCondition(tool.condition);

// Zaehlt Werkzeuge nach Kategorie oder Standort fuer Sammelberichte.
const countBy = (tools: Tool[], key: "category" | "location") => {
  return Object.entries(
    tools.reduce<Record<string, number>>((result, tool) => {
      const label = tool[key].trim() || "Nicht gepflegt";
      result[label] = (result[label] ?? 0) + 1;
      return result;
    }, {})
  ).sort((first, second) => second[1] - first[1]);
};

// CSV- und HTML-Escaping schuetzen die exportierten Inhalte vor kaputten Tabellen.
const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

const escapeHtml = (value: string | number) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Baut fuer jeden Berichtstyp die passenden Tabellenzeilen aus den Werkzeugdaten.
const getRowsForReport = (reportType: ReportType, tools: Tool[]): ReportRow[] => {
  if (reportType === "maintenance") {
    return tools
      .filter(hasMaintenanceReportEntry)
      .sort((first, second) =>
        (first.maintenance_date ?? "9999-12-31").localeCompare(
          second.maintenance_date ?? "9999-12-31"
        )
      )
      .map((tool) => ({
        Name: tool.name,
        Kategorie: tool.category,
        Standort: tool.location,
        Zustand: tool.condition,
        Eingang: tool.received_date,
        Wartungstermin: tool.maintenance_date ?? "",
      }));
  }

  if (reportType === "locations") {
    return countBy(tools, "location").map(([location, count]) => ({
      Standort: location,
      Anzahl: count,
    }));
  }

  if (reportType === "categories") {
    return countBy(tools, "category").map(([category, count]) => ({
      Kategorie: category,
      Anzahl: count,
    }));
  }

  if (reportType === "incoming") {
    return [...tools]
      .sort((first, second) =>
        second.received_date.localeCompare(first.received_date)
      )
      .map((tool) => ({
        Eingang: tool.received_date,
        Name: tool.name,
        Kategorie: tool.category,
        Standort: tool.location,
        Zustand: tool.condition,
        Wartungstermin: tool.maintenance_date ?? "",
      }));
  }

  return tools.map((tool) => ({
    Name: tool.name,
    Kategorie: tool.category,
    Standort: tool.location,
    Zustand: tool.condition,
    Eingang: tool.received_date,
    Wartungstermin: tool.maintenance_date ?? "",
  }));
};

// Browser-Download fuer CSV-Dateien ohne zusaetzliche Bibliothek.
const downloadCsv = (filename: string, csv: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// HTML-Tabelle fuer die Druckansicht. Der Browser kann diese Ansicht als PDF speichern.
const buildReportTableHtml = (title: string, rows: ReportRow[]) => {
  if (rows.length === 0) {
    return `
      <section class="report-section">
        <h2>${escapeHtml(title)}</h2>
        <p>Keine Daten vorhanden.</p>
      </section>
    `;
  }

  const headers = Object.keys(rows[0]);
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${headers
          .map((header) => `<td>${escapeHtml(row[header])}</td>`)
          .join("")}</tr>`
    )
    .join("");

  return `
    <section class="report-section">
      <h2>${escapeHtml(title)}</h2>
      <table>
        <thead>
          <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </section>
  `;
};

// Oeffnet ein separates Druckfenster. Ueber den Druckdialog kann der Benutzer PDF waehlen.
const openPrintWindow = (title: string, bodyContent: string) => {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    return;
  }

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body {
            margin: 32px;
            color: #0f172a;
            font-family: Arial, sans-serif;
          }

          h1 {
            margin: 0 0 6px;
            font-size: 24px;
          }

          h2 {
            margin: 28px 0 10px;
            font-size: 18px;
          }

          p {
            margin: 0 0 20px;
            color: #64748b;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          tr {
            page-break-inside: avoid;
          }

          th,
          td {
            padding: 10px;
            border: 1px solid #cbd5e1;
            text-align: left;
          }

          th {
            background: #eff6ff;
          }

          .report-section {
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <p>WerkMeister Bericht - ${new Date().toLocaleDateString("de-DE")}</p>
        ${bodyContent}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

function ReportsPage({ tools }: Props) {
  // Merkt sich, welcher Bericht gerade ausgewaehlt ist.
  const [selectedReport, setSelectedReport] = useState<ReportType>("inventory");

  const selectedOption = reportOptions.find((report) => report.id === selectedReport);

  // Kennzahlen oben auf der Berichte-Seite.
  const maintenanceCount = tools.filter(hasMaintenanceReportEntry).length;
  const categoriesCount = countBy(tools, "category").length;
  const locationsCount = countBy(tools, "location").length;
  const incomingCount = tools.filter((tool) => tool.received_date).length;

  const inventoryStats = [
    {
      label: "Inventar gesamt",
      value: tools.length,
      hint: "Werkzeuge",
      icon: ClipboardList,
    },
    {
      label: "Kategorien",
      value: categoriesCount,
      hint: "Gruppen",
      icon: Tags,
    },
    {
      label: "Standorte",
      value: locationsCount,
      hint: "Lagerorte",
      icon: MapPin,
    },
    {
      label: "Wartung",
      value: maintenanceCount,
      hint: "auffaellig",
      icon: ShieldAlert,
    },
    {
      label: "Eingaenge",
      value: incomingCount,
      hint: "mit Datum",
      icon: CalendarDays,
    },
  ];

  // Tabellenzeilen werden nur neu berechnet, wenn Daten oder Berichtstyp wechseln.
  const rows = useMemo(() => {
    return getRowsForReport(selectedReport, tools);
  }, [selectedReport, tools]);

  // Exportiert den aktuell ausgewaehlten Bericht als CSV.
  const downloadReport = () => {
    if (rows.length === 0) {
      return;
    }

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.map(escapeCsv).join(";"),
      ...rows.map((row) =>
        headers.map((header) => escapeCsv(row[header])).join(";")
      ),
    ].join("\n");

    downloadCsv(`${selectedReport}-bericht.csv`, csv);
  };

  // Erzeugt fuer den aktuellen Bericht eine druckbare PDF-Vorlage.
  const printReportAsPdf = () => {
    if (rows.length === 0) {
      return;
    }

    openPrintWindow(
      selectedOption?.title ?? "Bericht",
      buildReportTableHtml(selectedOption?.title ?? "Bericht", rows)
    );
  };

  // Kombiniert alle Berichtstypen in einer einzigen PDF-Druckansicht.
  const printAllReportsAsPdf = () => {
    const sections = reportOptions
      .map((report) =>
        buildReportTableHtml(report.title, getRowsForReport(report.id, tools))
      )
      .join("");

    openPrintWindow("Alle WerkMeister Berichte", sections);
  };

  return (
    <div className="reports-page">
      <section className="reports-hero">
        <div>
          <p className="page-eyebrow">Berichte</p>
          <h2>Berichte aus deinen Werkzeugdaten erstellen</h2>
          <p>
            Waehle einen Berichtstyp aus und exportiere die aktuelle Auswertung
            als CSV-Datei.
          </p>
        </div>

        <div className="report-actions">
          <button className="report-download" type="button" onClick={downloadReport}>
            <Download size={18} />
            CSV exportieren
          </button>
          <button className="report-download secondary" type="button" onClick={printReportAsPdf}>
            <Printer size={18} />
            PDF speichern
          </button>
          <button className="report-download all" type="button" onClick={printAllReportsAsPdf}>
            <Printer size={18} />
            Alle Berichte PDF
          </button>
        </div>
      </section>

      <section className="inventory-stats" aria-label="Inventar Statistik">
        {inventoryStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="inventory-stat" key={stat.label}>
              <div className="inventory-stat-icon">
                <Icon size={18} />
              </div>
              <div>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.hint}</small>
              </div>
            </article>
          );
        })}
      </section>

      <section className="report-options" aria-label="Berichtstypen">
        {reportOptions.map((report) => {
          const Icon = report.icon;

          return (
            <button
              key={report.id}
              className={`report-option ${
                selectedReport === report.id ? "active" : ""
              }`}
              type="button"
              onClick={() => setSelectedReport(report.id)}
            >
              <Icon size={20} />
              <span>{report.title}</span>
              <small>{report.description}</small>
            </button>
          );
        })}
      </section>

      <section className="report-preview">
        <div className="report-preview-header">
          <div>
            <span className="page-eyebrow">Vorschau</span>
            <h3>{selectedOption?.title}</h3>
          </div>
          <strong>{rows.length} Eintraege</strong>
        </div>

        {rows.length > 0 ? (
          <div className="report-table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  {Object.keys(rows[0]).map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 8).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, valueIndex) => (
                      <td key={valueIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="report-empty">
            Fuer diesen Bericht sind noch keine passenden Daten vorhanden.
          </p>
        )}
      </section>
    </div>
  );
}

export default ReportsPage;
