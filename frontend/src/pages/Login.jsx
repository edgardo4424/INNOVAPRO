import { APP_VERSION } from "../config";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // Importamos reCAPTCHA
import styles from "../styles/Login.module.css";
import "../styles/global.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const recaptchaRef = useRef(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null); // Guardamos el token del reCAPTCHA
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ⏳ Estado de carga

  useEffect(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset(); // 🔹 Reinicia el reCAPTCHA al cargar la página
    }
  }, []);

  function handleRecaptcha(value) {
    setRecaptchaToken(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return; // ⛔ Evitar múltiples clics

    if (!recaptchaToken) {
      alert("❌ Debes completar el reCAPTCHA.");
      return;
    }

    setLoading(true); // 🔥 Desactiva el botón

    const success = await login(email, password, recaptchaToken);
    if (success) {
      console.log("✅ Login exitoso. Redirigiendo al dashboard...");
      navigate("/dashboard");
    } else {
      alert("❌ Credenciales incorrectas o fallo en reCAPTCHA.");
      setLoading(false); // 🔥 Reactiva el botón
    }
  }

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-box"]}>
      <img src={`${process.env.PUBLIC_URL}/images/logo_blanco.png`} alt="Logo Innova" className={styles["login-logo"]} />
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
            <ReCAPTCHA ref={recaptchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={handleRecaptcha}
              theme="dark"
              size="normal"
            />
          </div>

          <button type="submit" disabled={loading} className={styles["login-button"]}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
      </div>
      <p className={styles["login-version"]}>{APP_VERSION}</p>
    </div>
  );
}