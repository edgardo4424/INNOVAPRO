// 🚀 BLOQUEO TOTAL DE 'UNDICI' Y WEBASSEMBLY DESDE EL CORE
process.env.UNDIICI_NO_WASM = "1";
process.env.UNDICI_DISABLE_GLOBAL = "true";
process.env.WASM_DISABLE = "1";
process.env.NODE_NO_WARNINGS = "1";
process.env.NODE_OPTIONS = "--no-experimental-fetch";

// 📌 Carga de módulos necesarios
require("./config/env"); // Cargar variables de entorno globalmente
const express = require("express");
const cors = require("cors");
const http = require("http"); // 🔥 Agregar esta línea si no está
const socketIo = require("socket.io");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const db = require("./database/models"); // Importa Sequelize para la conexión
const routes = require("./routes"); // Importa rutas
const path = require("path");

// require('./shared/utils/botTelegram');

const app = express();
const server = http.createServer(app);

// 🔥 Detectamos si estamos en producción o desarrollo
const PORT = process.env.PORT || 3001;
const API_BASE_URL = process.env.API_URL || "http://localhost:3001/api";

// ✅ Aplicar middlewares globales
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(compression()); // 🔥 Reduce el tamaño de las respuestas
app.use(helmet()); // 🛡️ Protege contra ataques comunes
app.use(morgan("dev")); // Registra las solicitudes en consola

// ⏳ Timeout extendido sin cortar conexiones
app.use((req, res, next) => {
    res.setTimeout(2400000, () => {
    });
    next();
});

app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads'), {
    cacheControl: true,
    maxAge: '30d',
}));

app.use(
  "/public",
  express.static(path.resolve(process.cwd(), "storage"), {
    fallthrough: false,   // 404 si no existe (no cae al SPA)
    cacheControl: true,
    maxAge: "30d",
  })
);


// 📂 Cargar rutas correctamente (SIN DUPLICAR)
const API_BASE_PATH = process.env.NODE_ENV === "production" ? "/backend/api" : "/api";
app.use(API_BASE_PATH, routes);
console.log(`🔀 API corriendo en: ${API_BASE_PATH}`);

// Ruta de archivos
const archivoRoutes = require('./modules/archivos/interfaces/routes/archivosRoutes');
app.use(`${API_BASE_PATH}/archivos`, archivoRoutes);


// ✅ Verificar conexión a la base de datos antes de iniciar el servidor
(async () => {
    try {
        const start = Date.now()
        await db.sequelize.authenticate();
        console.log(`⏳ Conexión establecida en ${Date.now() - start}ms`);

        console.log("✅ Conexión exitosa a la base de datos.");

        // 🚀 Iniciar el servidor solo si la base de datos está conectada
        server.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Servidor corriendo en ${API_BASE_URL}`);
        });
    } catch (err) {
        console.error("❌ Error de conexión a la base de datos:", err);
        process.exit(1); // ⛔ Detiene el servidor si no hay conexión
    }
})();

// INICIALIZA LOS SOCKETS DESPUÉS DEL SERVER
const { inicializarWebSockets } = require("./shared/utils/websockets");
inicializarWebSockets(server);

// 📌 Ruta de prueba para verificar el estado del backend
app.get("/", (req, res) => {
    res.json({ message: `🚀 Backend de Innova corriendo en ${API_BASE_URL}` });
});

// ✅ Intentar forzar Garbage Collector si está disponible
if (global.gc) {
    console.log("✅ Garbage Collector habilitado.");
    global.gc();
} else {
    console.log("⚠️ Garbage Collector no disponible en este entorno.");
}
