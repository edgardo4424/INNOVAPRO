const SequelizeFacturaRepository = require('../../infrastructure/repositories/sequelizeFacturaRepository')

const obtenerTodasLasFacturas = require('../../application/useCases/factura-boleta/obtenerTodasLasFacturas')

const obtenerFacturaPorId = require('../../application/useCases/factura-boleta/obtenerFacturaPorId')

const crearFactura = require('../../application/useCases/factura-boleta/crearFactura')

const obtenerCorrelativo = require('../../application/useCases/factura-boleta/obtenerCorrelativo')

const obtenerMTC = require('../../application/useCases/factura-boleta/obtenerMTC')

const facturaRepository = new SequelizeFacturaRepository()

const facturaController = {
    async obtenerFacturas(req, res) {
        try {
            console.log("🚚 Atributos para obtener facturas:", req.query);
            // const { tipo, page = 1, limit = 10, num_doc, tip_doc, fec_des, fec_ast } = req.query;
            const { codigo, respuesta } = await obtenerTodasLasFacturas(facturaRepository, req.query);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async obtenerFacturaPorId(req, res) {
        try {
            const id = req.params.id
            console.log(id);
            const { codigo, respuesta } = await obtenerFacturaPorId(id, facturaRepository)
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
    },

    async obtenerCorrelativo(_, res) {
        try {
            const { codigo, respuesta } = await obtenerCorrelativo(facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },
    // !!! PLAYWRIGHT
    async obtenerMTCconRuc(req, res) {
        try {
            const { ruc } = req.query;
            console.log("🚚 Atributos para obtener MTC:desde el controller", ruc);

            const { codigo, respuesta } = await obtenerMTC(ruc);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    }
}

module.exports = facturaController;