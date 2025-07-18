const express = require("express");
const router = express.Router();
const condicionController = require("../controllers/condicionAlquilerController");
const { verificarToken } = require("../../../../../shared/middlewares/authMiddleware");
const { tieneRol } = require("../../../../../shared/middlewares/rolMiddleware");

router.use(verificarToken); // Verifica sesión en todas

router.get(
  "/pendientes",
  tieneRol(["Gerencia", "Administracion"]),
  condicionController.obtenerPendientes
);

router.put(
  "/:id",
  tieneRol(["Gerencia", "Administracion"]),
  condicionController.responderCondicion
);

router.put("/marcar-cumplidas/:cotizacionId", verificarToken, condicionController.marcarCumplidas);

router.get(
  "/:id",
  verificarToken,
  condicionController.obtenerPorCotizacionId
);

module.exports = router;