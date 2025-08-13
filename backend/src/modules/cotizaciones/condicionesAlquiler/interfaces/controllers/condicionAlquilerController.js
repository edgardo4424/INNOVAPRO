const obtenerCondicionesPendientes = require("../../application/useCases/obtenerCondicionesPendientes");
const responderCondicionUseCase = require("../../application/useCases/responderCondicion");
const marcarCondicionesCumplidas = require("../../application/useCases/marcarCondicionesCumplidas");
const sequelizeCondicionAlquilerRepository = require("../../infrastructure/repositories/sequelizeCondicionAlquilerRepository");
const sequelizeCotizacionRepository = require("../../../infrastructure/repositories/sequelizeCotizacionRepository");

const condicionRepository = new sequelizeCondicionAlquilerRepository();
const cotizacionRepository = new sequelizeCotizacionRepository();

const CondicionAlquilerController = {
  async obtenerPendientes(req, res) {
    try {
      const data = await obtenerCondicionesPendientes(condicionRepository);
      res.json(data);
    } catch (error) {
      console.error("❌ Error al obtener condiciones:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  },

  async responderCondicion(req, res) {
    try {
      const { condiciones } = req.body;
      const actualizado_por = req.usuario?.id || null;
      const cotizacionId = parseInt(req.params.id);

      const resultado = await responderCondicionUseCase(
        cotizacionId, 
        condiciones, 
        actualizado_por, 
        condicionRepository,
        cotizacionRepository
    );

      res.status(resultado.codigo).json(resultado.respuesta);
    } catch (error) {
      console.error("❌ Error al responder condición:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  },

  async marcarCumplidas(req, res) {
    try {
        const cotizacionId = parseInt(req.params.cotizacionId);
        const { condiciones_cumplidas } = req.body;

        const resultado = await marcarCondicionesCumplidas(
            cotizacionId,
            condiciones_cumplidas,
            condicionRepository,
            cotizacionRepository
        );

        res.status(resultado.codigo).json(resultado.respuesta);
        } catch (error) {
            console.error("❌ Error al marcar condiciones como cumplidas:", error);
            res.status(500).json({ mensaje: "Error interno del servidor" });
        }
    },

    async obtenerPorCotizacionId(req, res) {
        const cotizacionId = parseInt(req.params.id);
        const condicion = await condicionRepository.obtenerPorCotizacionId(cotizacionId);
        if (!condicion) return res.status(404).json({ mensaje: "No se encontró la condición" });
        res.json(condicion);
    }

};

module.exports = CondicionAlquilerController;