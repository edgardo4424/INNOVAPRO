const express = require("express");
const router = express.Router();
const sunatController= require("../controllers/sunatController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");
const { esGerente } = require("../../../../shared/middlewares/rolMiddleware");

router.get("/buscar-ruc/:ruc", sunatController.buscarPorRUC);
router.post("/importar-sunat", verificarToken, esGerente, sunatController.importarPadronSUNAT);

module.exports = router;