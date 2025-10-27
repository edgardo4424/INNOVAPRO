const emitirFactura = require("../../application/emitirFactura");
const emitirGuia = require("../../application/emitirGuia");

const verificarEstadoSunat = require("../../application/verificarEstadoSunat");

const sequelizFactilizaRepository = require("../../infrastructure/repositories/sequelizeFactilizaRepository");

const SequelizeFacturaRepository = require("../../../facturacion/infrastructure/repositories/sequelizeFacturaRepository");

const SequelizeGuiaRemisionRepository = require("../../../facturacion/infrastructure/repositories/sequelizeGuiaRemisionRepository");

const SequelizeNotasCreditoDebitoRepository = require("../../../facturacion/infrastructure/repositories/sequelizeNotasCreditoDebito");

const sequelizeBorradorRespository = require("../../../facturacion/infrastructure/repositories/sequelizeBorradorRespository");

const emitirNota = require("../../application/emitirNota");

const factilizaRepository = new sequelizFactilizaRepository()

const facturaRepository = new SequelizeFacturaRepository()

const notaRepository = new SequelizeNotasCreditoDebitoRepository()

const guiaRemisionRepository = new SequelizeGuiaRemisionRepository()

const borradorRepository = new sequelizeBorradorRespository()


const factilizaController = {

    async verificarEstadoSunat(req, res) {
        try {
            const { codigo, respuesta } = await verificarEstadoSunat(req.body, factilizaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })

        }
    },

    async emitirFactura(req, res) {
        try {
            const { codigo, respuesta } = await emitirFactura(req.body, facturaRepository, borradorRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },

    async emitirGuia(req, res) {
        try {
            const { codigo, respuesta } = await emitirGuia(req.body, guiaRemisionRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },

    async emitirNota(req, res) {
        try {
            const { codigo, respuesta } = await emitirNota(req.body, notaRepository, borradorRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    }
}

module.exports = factilizaController;