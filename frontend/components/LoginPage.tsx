import "./LoginPage.css";
import { Lock, LogIn, Mail, UserRound } from "lucide-react";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <UserRound size={24} />
          </div>
          <div>
            <p className="login-eyebrow">Benutzerkonto</p>
            <h2>Login Daten eingeben</h2>
            <span>Melde dich fuer WerkMeister an.</span>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>E-Mail</span>
            <div className="login-input">
              <Mail size={17} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@firma.de"
              />
            </div>
          </label>

          <label className="login-field">
            <span>Passwort</span>
            <div className="login-input">
              <Lock size={17} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Passwort"
              />
            </div>
          </label>

          <button className="login-submit" type="submit">
            <LogIn size={18} />
            Einloggen
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
