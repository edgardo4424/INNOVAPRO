const express = require("express");
const router = express.Router();
const cargosSunatController = require("../controllers/cargosSunatController");

const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken);

router.get("/", cargosSunatController.obtenerTodosLosCargosSunat)

router.post("/", cargosSunatController.obtenerCargosSunat);

module.exports = router;