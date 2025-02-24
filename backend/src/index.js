const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./models"); // Importa Sequelize para asegurar la conexión
const routes = require("./routes"); // Importa el index.js de routes

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setTimeout(2400000, () => {
    console.log("⏳ La solicitud está tardando, pero no interrumpimos al usuario.");
  });
  next();
});

// 📌 Cargar rutas correctamente (SIN DUPLICAR)
app.use("/api", routes); 

// Verificar conexión a la base de datos y sincronizar modelos si es necesario
db.sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ Conexión exitosa a la base de datos");

    // 🔥 Mostrar las tablas reconocidas por Sequelize
    const tablas = await db.sequelize.getQueryInterface().showAllTables();
    console.log("📂 Tablas detectadas:", tablas);

    // 🔄 Sincronizar modelos (SOLO SI ES NECESARIO, USAR CON CUIDADO)
    // await db.sequelize.sync({ alter: true }); // Descomentar si quieres que las tablas se ajusten automáticamente
  })
  .catch((err) => console.error("❌ Error de conexión a la base de datos:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});