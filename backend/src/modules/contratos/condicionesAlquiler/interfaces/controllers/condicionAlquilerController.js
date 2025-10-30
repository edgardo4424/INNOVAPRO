const obtenerCondicionesPendientes = require("../../application/useCases/obtenerCondicionesPendientes");
const responderCondicionUseCase = require("../../application/useCases/responderCondicion");
const marcarCondicionesCumplidas = require("../../application/useCases/marcarCondicionesCumplidas");
const sequelizeCondicionAlquilerRepository = require("../../infrastructure/repositories/sequelizeCondicionAlquilerRepository");
const sequelizeContratoRepository = require("../../../infraestructure/repositories/sequelizeContratoRepository");

const condicionRepository = new sequelizeCondicionAlquilerRepository();
const contratoRepository = new sequelizeContratoRepository();

const SequelizePasePedidoRepository = require("../../../../pases_pedidos/infraestructure/repositories/sequelizePasePedidoRepository");
const pasePedidoRepository = new SequelizePasePedidoRepository();

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
      const contratoId = parseInt(req.params.id);

      const resultado = await responderCondicionUseCase(
        contratoId, 
        condiciones, 
        actualizado_por, 
        condicionRepository,
        contratoRepository
    );

      res.status(resultado.codigo).json(resultado.respuesta);
    } catch (error) {
      console.error("❌ Error al responder condición:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  },

  async marcarCumplidas(req, res) {
    
    try {
        const contratoId = parseInt(req.params.contratoId);
        const { condiciones_cumplidas } = req.body;

        const resultado = await marcarCondicionesCumplidas(
            contratoId,
            condiciones_cumplidas,
            condicionRepository,
            contratoRepository,
            pasePedidoRepository
        );

        res.status(resultado.codigo).json(resultado.respuesta);
        } catch (error) {
            console.error("❌ Error al marcar condiciones como cumplidas:", error);
            res.status(500).json({ mensaje: "Error interno del servidor" });
        }
    },

    async obtenerPorContratoId(req, res) {
        const contratoId = parseInt(req.params.id);
        const condicion = await condicionRepository.obtenerPorContratoId(contratoId);
        if (!condicion) return res.status(404).json({ mensaje: "No se encontró la condición" });
        res.json(condicion);
    }

};

module.exports = CondicionAlquilerController;