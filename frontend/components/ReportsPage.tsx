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

type Tool = {
  id: number;
  name: string;
  category: string;
  location: string;
  condition: string;
  received_date: string;
};

type Props = {
  tools: Tool[];
};

type ReportType = "inventory" | "maintenance" | "locations" | "categories" | "incoming";

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
    description: "Werkzeuge mit auffaelligem Zustand.",
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

const countBy = (tools: Tool[], key: "category" | "location") => {
  return Object.entries(
    tools.reduce<Record<string, number>>((result, tool) => {
      const label = tool[key].trim() || "Nicht gepflegt";
      result[label] = (result[label] ?? 0) + 1;
      return result;
    }, {})
  ).sort((first, second) => second[1] - first[1]);
};

const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

function ReportsPage({ tools }: Props) {
  const [selectedReport, setSelectedReport] = useState<ReportType>("inventory");

  const selectedOption = reportOptions.find((report) => report.id === selectedReport);

  const rows = useMemo(() => {
    if (selectedReport === "maintenance") {
      return tools
        .filter((tool) => isMaintenanceCondition(tool.condition))
        .map((tool) => ({
          Name: tool.name,
          Kategorie: tool.category,
          Standort: tool.location,
          Zustand: tool.condition,
          Eingang: tool.received_date,
        }));
    }

    if (selectedReport === "locations") {
      return countBy(tools, "location").map(([location, count]) => ({
        Standort: location,
        Anzahl: count,
      }));
    }

    if (selectedReport === "categories") {
      return countBy(tools, "category").map(([category, count]) => ({
        Kategorie: category,
        Anzahl: count,
      }));
    }

    if (selectedReport === "incoming") {
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
        }));
    }

    return tools.map((tool) => ({
      Name: tool.name,
      Kategorie: tool.category,
      Standort: tool.location,
      Zustand: tool.condition,
      Eingang: tool.received_date,
    }));
  }, [selectedReport, tools]);

  const downloadReport = () => {
    if (rows.length === 0) {
      return;
    }

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.map(escapeCsv).join(";"),
      ...rows.map((row) =>
        headers.map((header) => escapeCsv(row[header as keyof typeof row])).join(";")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${selectedReport}-bericht.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReportAsPdf = () => {
    if (rows.length === 0) {
      return;
    }

    const headers = Object.keys(rows[0]);
    const tableRows = rows
      .map(
        (row) =>
          `<tr>${headers
            .map((header) => `<td>${row[header as keyof typeof row]}</td>`)
            .join("")}</tr>`
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${selectedOption?.title ?? "Bericht"}</title>
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

            p {
              margin: 0 0 20px;
              color: #64748b;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
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
          </style>
        </head>
        <body>
          <h1>${selectedOption?.title ?? "Bericht"}</h1>
          <p>WerkMeister Bericht · ${new Date().toLocaleDateString("de-DE")}</p>
          <table>
            <thead>
              <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
        </div>
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
