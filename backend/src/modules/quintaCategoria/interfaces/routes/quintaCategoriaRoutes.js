const express = require('express');
const router = express.Router();

const QuintaCategoriaController = require('../controllers/QuintaCategoriaController');
const MultiempleoController = require("../controllers/MultiempleoController");
const SoportePreviosController = require("../controllers/SoportePreviosController");
const QuintaCategoriaMasivoController = require('../controllers/QuintaCategoriaMasivoController');

const CierreQuintaController = require('../controllers/CierreQuintaController');

const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const bloqueoCierreQuinta = require('../middlewares/bloqueoCierreQuinta');

router.use(verificarToken); // Verificamos el token para todas las rutas

// CIERRES DE QUINTA
router.get('/cierres', CierreQuintaController.listar);
router.get('/cierres/estado', CierreQuintaController.estado);
router.post('/cierres/cerrar', CierreQuintaController.cerrar);

// CALCULOS DE QUINTA
router.post('/previsualizar', QuintaCategoriaController.previsualizar);
router.post('/', bloqueoCierreQuinta, QuintaCategoriaController.crear);
router.post('/:id/recalcular', bloqueoCierreQuinta, QuintaCategoriaController.recalcular);
router.get('/', QuintaCategoriaController.list);

// Api de consulta backend-backend
router.get('/base-mes', QuintaCategoriaController.getRetencionBaseMesPorDni);

// MASIVO POR FILIAL
router.post('/masivo', bloqueoCierreQuinta, QuintaCategoriaMasivoController.crearMasivo);

// MULTIEMPLEO INFERIDO (GET)
router.get('/multiempleo/inferido', QuintaCategoriaController.obtenerMultiempleoInferido);

// Declaración de multiempleo (SUNAT): registro/consulta por DNI/AÑO
router.get('/multiempleo/declaracion', MultiempleoController.obtenerDeclaracion);
router.post('/multiempleo/declaracion', MultiempleoController.insertarDeclaracion);

router.get('/certificado', SoportePreviosController.obtenerCertificado);
router.post('/certificado', SoportePreviosController.insertarCertificado);

router.get('/sin-previos', SoportePreviosController.obtenerSinPrevios);
router.post('/sin-previos', SoportePreviosController.insertarSinPrevios);


// HUB de soportes (todos en uno)
router.get('/soportes', SoportePreviosController.obtenerTodos);

/**
 * Cuando tenemos más de un get y hay uno con :id hay que ponerlo al último
 * porque va analizando de arriba a abajo y puede generar conflictos con los
 * demás get. (RECOMENDACIÓN DE LUIS)
 */
router.get('/:id', QuintaCategoriaController.getById);

module.exports = router; 