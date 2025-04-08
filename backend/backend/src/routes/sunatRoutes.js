const express = require("express");
const router = express.Router();
const { executeFullProcess } = require("../services/sunatPadronService");

router.get("/importar-sunat", async (req, res) => {
    try {
        await executeFullProcess();
        res.send("✅ Proceso de importación ejecutado correctamente.");
    } catch (error) {
        console.error("❌ Error en la importación:", error);
        res.status(500).send("Error en la importación.");
    }
});

module.exports = router;