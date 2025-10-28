const actualizarContrato = require("../../application/useCases/actualizarContrato");
const crearContrato = require("../../application/useCases/crearContrato");
const obtenerContratos = require("../../application/useCases/obtenerContratos");
const autocompletarCotizacionParaCrearContrato = require("../../application/useCases/autocompletarCotizacionParaCrearContrato");
const generarDataContratoParaDocumento = require("../../application/useCases/generarDataContratoParaDocumento");

const SequelizeContratoRepository = require("../../infraestructure/repositories/sequelizeContratoRepository");
const contratoRepository = new SequelizeContratoRepository();

const SequelizeCondicionAlquilerRepository = require("../../condicionesAlquiler/infrastructure/repositories/sequelizeCondicionAlquilerRepository");
const condicionRepository = new SequelizeCondicionAlquilerRepository();

const sequelize = require("../../../../database/models").sequelize;

// Casos de uso para condiciones de alquiler
const solicitarCondicionesAlquiler = require("../../application/useCases/solicitarCondicionesAlquiler");
const crearCondicionAlquiler = require("../../application/useCases/crearCondicionAlquiler");
const { documentoController } = require("../../infraestructure/services/contratosDocumentService");
const generarDocumentoContrato = require("../../application/useCases/generarDocumentoContrato");

const ContratoController = {
  async crearContrato(req, res) {
    console.log("Entro a la función de crear contrato");
    const payload = req.body;
    const usuario_id = req.usuario.id;
    const transaction = await sequelize.transaction();
    try {
      const contratoResponse = await crearContrato(
        payload,
        usuario_id,
        contratoRepository,
        transaction
      );
      // confirmar transacción antes de responder
      await transaction.commit();
      res.status(contratoResponse.codigo).json(contratoResponse.respuesta);
    } catch (error) {
      await transaction.rollback();
      console.log("Ocurrio el siguiente error: ", error);
      res.status(500).json({ error: error.message });
    }
  },
  async actualizarContrato(req, res) {
    console.log("Entro a la función de actualizar contrato");
    try {
      const payload = req.body;
      const usuario_id = req.usuario.id;
      const contratoResponse = await actualizarContrato(
        payload,
        usuario_id,
        contratoRepository
      );
      res.status(contratoResponse.codigo).json(contratoResponse.respuesta);
    } catch (error) {
      console.log("Ocurrio el siguiente error: ", error);
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerContratos(req, res) {
    console.log("Entro a la función de listar contratos");
    try {
      const contratos = await obtenerContratos(contratoRepository);
      res.status(contratos.codigo).json(contratos.respuesta);
    } catch (error) {
      console.log("Ocurrio el siguiente error: ", error);
      res.status(500).json({ error: error.message });
    }
  },

  async autocompletarCotizacionParaCrearContrato(req, res) {
    console.log(
      "Entro a la función de autocompletar cotización para crear contrato"
    );
    try {
      const cotizacion_id = req.params.id;
      const cotizacionResponse = await autocompletarCotizacionParaCrearContrato(
        cotizacion_id,
        contratoRepository
      );
      console.log(
        "Respuesta de autocompletarCotizacionParaCrearContrato:",
        cotizacionResponse
      );
      res.status(cotizacionResponse.codigo).json(cotizacionResponse.respuesta);
    } catch (error) {
      console.log("Ocurrio el siguiente error: ", error);
      res.status(500).json({ error: error.message });
    }
  },

  async solicitarCondiciones(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const contrato_id = parseInt(req.params.id);
      const comentario = req.body.comentario || "";
      const creado_por = req.usuario?.id || null;

      // Cambiamos el estado
      const cambio = await solicitarCondicionesAlquiler(
        contrato_id,
        contratoRepository,
        transaction
      );
      if (cambio.codigo !== 200)
        return res.status(cambio.codigo).json(cambio.respuesta);

      console.log("cambio", cambio);
      // Registramos el comentario solo si no existe aún
      const yaExiste = await condicionRepository.obtenerPorContratoId(
        contrato_id,
        transaction
      );
      console.log("Verificando existencia previa de condición:", yaExiste);
      if (!yaExiste) {
        await crearCondicionAlquiler(
          { contrato_id, comentario_solicitud: comentario, creado_por },
          condicionRepository,
          transaction
        );
      }
      // confirmar transacción antes de responder
      await transaction.commit();
      return res
        .status(201)
        .json({ mensaje: "Solicitud registrada correctamente" });
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error:", error);
      res.status(500).json({ mensaje: "Error al registrar la solicitud" });
    }
  },

  async generarDocumentoAutomatico(req, res) {
    console.log("Entro a la función de generar documento del contrato");
    const transaction = await sequelize.transaction();

    try {
      const contrato_id = req.params.contratoId;

       // Obteniendo los datos para la plantilla del contrato
      const dataContrato = await generarDataContratoParaDocumento(
        contrato_id,
        contratoRepository,
        transaction
      );

       if (!dataContrato || dataContrato.codigo !== 200) {
      await transaction.rollback();
      return res.status(404).json({ mensaje: "No se encontró data para generar documento" });
    }

     const data = dataContrato.respuesta || {};

      // Generando el documento automáticamente usando la data obtenida
      const respuesta = await generarDocumentoContrato(
        contrato_id,
        data,
        contratoRepository,
        transaction,
      );
      
      await transaction.commit();
      res.status(respuesta.codigo).json(respuesta.respuesta);
    } catch (error) {
      console.log("Ocurrio el siguiente error: ", error);
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = ContratoController;
