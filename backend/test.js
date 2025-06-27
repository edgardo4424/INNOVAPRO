const CryptoJS = require("crypto-js");
const { compressToEncodedURIComponent } = require("lz-string");

const SECRET_KEY = "mi_clave_secreta_segura"; // compartida entre frontend y backend

function generarTokenSeguro(data) {
  const json = JSON.stringify({ id: data }); // puedes agregar más info
  const encrypted = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();
  const compressed = compressToEncodedURIComponent(encrypted);
  
  // Garantiza que no supere 63 caracteres
  if (compressed.length > 63) {
    throw new Error("❌ Token demasiado largo. Intenta con datos más cortos.");
  }

  return compressed;
}

// 🔹 Ejemplo:
const token = generarTokenSeguro(123456);
console.log("🔐 Token:", token, "↩️ Length:", token.length);
