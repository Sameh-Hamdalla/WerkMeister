import "./Footer.css";
import { CircleHelp, FileText, ShieldCheck, Wrench } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Markenbereich der App bleibt links sichtbar. */}
        <div className="footer-brand">
          <div className="footer-logo" aria-hidden="true">
            <Wrench size={18} />
          </div>
          <div>
            <strong>WerkMeister</strong>
            <p>Inventarverwaltung fuer Werkstatt und Lager</p>
          </div>
        </div>

        {/* Rechtliche Links plus Entwicklerlink. HAMDALLA WEB fuehrt zur Homepage. */}
        <ul className="footer-links">
          <li>
            <a href="#">
              <ShieldCheck size={15} />
              Datenschutz
            </a>
          </li>
          <li>
            <a href="#">
              <FileText size={15} />
              Impressum
            </a>
          </li>
          <li>
            <a href="#">
              <CircleHelp size={15} />
              Support
            </a>
          </li>
          <li>
            <a href="https://www.hamdalla-web.com" target="_blank" rel="noreferrer">
              HAMDALLA WEB
            </a>
          </li>
        </ul>

        {/* Jahresangabe separat, damit sie im Layout frei positioniert werden kann. */}
        <span className="footer-copy">&copy; 2026</span>
      </div>
    </footer>
  );
}

export default Footer;

