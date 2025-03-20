import fetch from "node-fetch";

fetch("http://localhost:5000/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "lucas@innova.com",
    password: "admin123"
  })
})
  .then(res => res.json())
  .then(data => console.log("🟢 Respuesta del servidor:", data))
  .catch(err => console.error("❌ Error en la petición:", err));
