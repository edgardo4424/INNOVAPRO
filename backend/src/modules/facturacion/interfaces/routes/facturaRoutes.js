const express = require("express");
const router = express.Router();
const facturaController = require("../controllers/facturaController");

router.get("/", facturaController.obtenerFacturas);
module.exports = router;