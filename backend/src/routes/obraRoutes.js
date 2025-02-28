const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/authMiddleware");
const { crearObra } = require("../controllers/obraController");

const { Sequelize } = require("../models");
const db = require("../models");

router.post("/", verificarToken, crearObra);

router.get("/enum-ubicaciones", async (req, res) => {
  try {
    const query = `SHOW COLUMNS FROM Obras LIKE 'ubicacion'`;
    const [results] = await db.sequelize.query(query);
    
    if (results.length > 0) {
      const enumValues = results[0].Type.match(/enum\(([^)]+)\)/)[1]
        .replace(/'/g, "")
        .split(",");
      return res.json(enumValues);
    } else {
      return res.status(500).json({ error: "No se encontraron valores ENUM" });
    }
  } catch (error) {
    console.error("❌ Error obteniendo ENUM de ubicaciones:", error);
    return res.status(500).json({ error: "Error obteniendo valores ENUM" });
  }
});

module.exports = router;