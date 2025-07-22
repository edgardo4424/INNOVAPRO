const SequelizeFacturaRepository = require('../../infrastructure/repositories/sequelizeFacturaRepository')

const obtenerTodasLasFacturas = require('../../application/useCases/obtenerTodasLasFacturas')

const obtenerFacturaPorId = require('../../application/useCases/obtenerFacturoPorId')

const crearFactura = require('../../application/useCases/crearFactura')

const facturaRepository = new SequelizeFacturaRepository()

const facturaController = {
    async obtenerFacturas(_, res) {
        try {
            const { codigo, respuesta } = await obtenerTodasLasFacturas(facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    async obtenerFacturaPorId(req, res) {
        try {
            const id = req.params.id
            console.log(id);
            const { codigo, respuesta } = await obtenerFacturaPorId(id,facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    async crearFactura(req, res) {
        try {
            console.log("🚚 Atributos para crear factura:", req.body);
            const { codigo, respuesta } = await crearFactura(req.body, facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = facturaController;