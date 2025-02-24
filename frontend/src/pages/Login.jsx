import { APP_VERSION } from "../config";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // Importamos reCAPTCHA
import styles from "../styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null); // Guardamos el token del reCAPTCHA
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!recaptchaToken) {
      alert("❌ Debes completar el reCAPTCHA.");
      return;
    }

    const success = await login(email, password, recaptchaToken);
    if (success) {
      console.log("✅ Login exitoso. Redirigiendo al dashboard...");
      navigate("/dashboard");
    } else {
      alert("❌ Credenciales incorrectas o fallo en reCAPTCHA.");
    }
  }

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-box"]}>
        <img src="/images/logo_azul.png" alt="Logo Innova" className={styles["login-logo"]} />
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["login-input"]}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["login-input"]}
            required
          />
          <div className={styles["recaptcha-container"]}>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div>

          <button type="submit" className={styles["login-button"]}>
            Ingresar
          </button>
        </form>
        <p className={styles["login-version"]}>{APP_VERSION}</p>
      </div>
    </div>
  );
}