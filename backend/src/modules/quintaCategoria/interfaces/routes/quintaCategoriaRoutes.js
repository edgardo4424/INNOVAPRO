const express = require('express');
const router = express.Router();
const QuintaCategoriaController = require('../controllers/QuintaCategoriaController');
const MultiempleoController = require("../controllers/MultiempleoController");
const SoportePreviosController = require("../controllers/SoportePreviosController");
const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verificamos el token para todas las rutas

router.post('/previsualizar', QuintaCategoriaController.previsualizar);
router.post('/', QuintaCategoriaController.crear);
router.post('/:id/recalcular', QuintaCategoriaController.recalcular);
router.get('/', QuintaCategoriaController.list);

// Api de consulta backend-backend
router.get('/base-mes', QuintaCategoriaController.getRetencionBaseMesPorDni);

// Declaración de multiempleo (SUNAT): registro/consulta por DNI/AÑO
router.get('/multiempleo/declaracion', MultiempleoController.obtenerDeclaracion);
router.post('/multiempleo/declaracion', MultiempleoController.insertarDeclaracion);

router.get('/certificado', SoportePreviosController.obtenerCertificado);
router.post('/certificado', SoportePreviosController.insertarCertificado);

router.get('/sin-previos', SoportePreviosController.obtenerSinPrevios);
router.post('/sin-previos', SoportePreviosController.insertarSinPrevios);

/**
 * Cuando tenemos más de un get y hay uno con :id hay que ponerlo al último
 * porque va analizando de arriba a abajo y puede generar conflictos con los
 * demás get. (RECOMENDACIÓN DE LUIS)
 */
router.get('/:id', QuintaCategoriaController.getById);

module.exports = router; 