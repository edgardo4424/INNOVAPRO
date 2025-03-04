// 🚀 BLOQUEO TOTAL DE 'UNDICI' Y WEBASSEMBLY DESDE EL CORE
process.env.UNDIICI_NO_WASM = "1";
process.env.UNDICI_DISABLE_GLOBAL = "true";
process.env.WASM_DISABLE = "1";
process.env.NODE_NO_WARNINGS = "1";
process.env.NODE_OPTIONS = "--no-experimental-fetch";

// 🚀 Eliminamos WebAssembly por completo
global.WebAssembly = undefined;
global.fetch = undefined;

// 🔥 REDEFINIR REQUIRE PARA BLOQUEAR 'UNDICI' Y EVITAR QUE NODE LO USE
const Module = require("module");
const originalRequire = Module.prototype.require;
Module.prototype.require = function (path) {
    if (path.includes("undici") || path.includes("fetch") || path.includes("llhttpWasmData")) {
        throw new Error("🚫 Bloqueo forzado: 'undici' y 'fetch' han sido eliminados.");
    }
    return originalRequire.apply(this, arguments);
};

console.log("🚀 'undici' y 'fetch' han sido completamente erradicados.");
console.log("🚀 WebAssembly completamente deshabilitado.");

// 📌 Carga de módulos necesarios
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const db = require("./models"); // Importa Sequelize para la conexión
const routes = require("./routes"); // Importa rutas

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Aplicar middlewares globales
app.use(cors());
app.use(express.json());
app.use(compression()); // 🔥 Reduce el tamaño de las respuestas
app.use(helmet()); // 🛡️ Protege contra ataques comunes

// ⏳ Timeout extendido sin cortar conexiones
app.use((req, res, next) => {
    res.setTimeout(2400000, () => {
        console.log("⏳ La solicitud está tardando, pero no interrumpimos al usuario.");
    });
    next();
});

// 📂 Cargar rutas correctamente (SIN DUPLICAR)
app.use("/api", routes);

// ✅ Verificar conexión a la base de datos antes de iniciar el servidor
(async () => {
    try {
        await db.sequelize.authenticate();
        console.log("✅ Conexión exitosa a la base de datos.");

        // 🔥 Mostrar las tablas reconocidas por Sequelize
        const tablas = await db.sequelize.getQueryInterface().showAllTables();
        console.log("📂 Tablas detectadas:", tablas);

        // 🚀 Iniciar el servidor solo si la base de datos está conectada
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Error de conexión a la base de datos:", err);
        process.exit(1); // ⛔ Detiene el servidor si no hay conexión
    }
})();

// 📌 Ruta de prueba para verificar el estado del backend
app.get("/", (req, res) => {
    res.json({ message: "🚀 Backend de Innova corriendo correctamente." });
});

// ✅ Intentar forzar Garbage Collector si está disponible
if (global.gc) {
    console.log("✅ Garbage Collector habilitado.");
    global.gc();
} else {
    console.log("⚠️ Garbage Collector no disponible en este entorno.");
}