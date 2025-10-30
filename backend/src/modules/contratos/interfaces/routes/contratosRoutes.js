const express = require("express");
const router = express.Router();

const {
   verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const ContratoController = require("../controllers/contratosController");
router.use(verificarToken); // Verificamos el token para todas las rutas


router.get("/",ContratoController.obtenerContratos);
router.post("/",ContratoController.crearContrato);
router.put("/",ContratoController.actualizarContrato);
router.get("/autocompletar-cotizacion/:id", ContratoController.autocompletarCotizacionParaCrearContrato);


// Ruta para solicitar condiciones de alquiler de un contrato 
router.put("/:id/solicitar-condiciones", ContratoController.solicitarCondiciones);

// Ruta para generar contrato en formato pdf
router.post("/:contratoId/documentos/render", ContratoController.generarDocumentoAutomatico) // Generar el documento automaticamente usando toda la data de la base de datos

//Ruta para obtener documentos vinculados a un contrato
router.get("/:contratoId/documentos", ContratoController.obtenerDocumentosPorCodigoContrato);

//Ruta para subir un contrato oficializado
//router.post("/:contratoId/documentos/subir-oficializado", ContratoController.subirDocumentoOficializado);

// Nueva ruta protegida para descargar un documento (requiere token)
//router.get("/:contratoId/documentos/download", ContratoController.descargarDocumento);


// Ruta para subir una plantilla y renderizarla vinculada a un contrato
// Nota: el controller espera req/res normales; aquí le añadimos req.params.contratoId para que pueda usarla
/* router.post(
  "/:contratoId/documentos/plantilla/render",
  upload.single("file"),
  async (req, res, next) => {
    try {
      // adjunta el contratoId para que el controller o el use-case puedan usarlo
      req.body.contratoId = req.params.contratoId;

      // Opcional: puedes pasar más datos en req.body (placeholders, opciones)
      // Llamamos al controller que ya maneja la generación y guardado del docx
      await documentoController.render(req, res);
    } catch (err) {
      next(err);
    }
  }
); */

module.exports = router;