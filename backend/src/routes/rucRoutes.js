const express = require("express");
const router = express.Router();
const sunatController = require("../controllers/sunatController");

router.get("/buscar-ruc/:ruc", sunatController.buscarRUC);

module.exports = router;