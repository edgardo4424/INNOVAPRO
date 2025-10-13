const SequelizeFacturaRepository = require('../../infrastructure/repositories/sequelizeFacturaRepository')

const SequelizeBorradorRepository = require('../../infrastructure/repositories/sequelizeBorradorRespository')

const obtenerTodasLasFacturas = require('../../application/useCases/factura-boleta/obtenerTodasLasFacturas')

const obtenerFacturaPorId = require('../../application/useCases/factura-boleta/obtenerFacturaPorId')

const obtenerFacturaDetallada = require('../../application/useCases/factura-boleta/obtenerFacturaDetallada')

const crearFactura = require('../../application/useCases/factura-boleta/crearFactura')

const obtenerCorrelativo = require('../../application/useCases/factura-boleta/obtenerCorrelativo')

const obtenerFacturasPorRuc = require('../../application/useCases/factura-boleta/obtenerFacturasPorRuc')

const anularFactura = require('../../application/useCases/factura-boleta/anularFactura')

const obtenerCdrZip = require('../../application/useCases/factura-boleta/obtenerCdrZip')

const obtenerMTC = require('../../application/useCases/factura-boleta/obtenerMTC')

const reporteVentas = require('../../application/useCases/factura-boleta/reporteVentas')

const obtenerCorrelativoPendientes = require('../../application/useCases/factura-boleta/obtenerCorrelativoPendientes')

const reporteDasboard = require('../../application/useCases/factura-boleta/reporteDasboard')

const verificarCorrelativoRegistrado = require('../../application/useCases/factura-boleta/verificarCorrelativoRegistrado')
const documentosPendientes = require('../../application/useCases/factura-boleta/documentosPendientes')


const facturaRepository = new SequelizeFacturaRepository()

const borradorRepository = new SequelizeBorradorRepository()


const facturaController = {
    async obtenerFacturas(req, res) {
        // * Controlador para obtener todas las facturas, se encarga de llamar al caso de uso
        // * "obtenerTodasLasFacturas" y devolver su respuesta
        // * el resultado sera filtrado segun el query
        try {
            // const { tipo, page = 1, limit = 10, num_doc, tip_doc, fec_des, fec_ast } = req.query;
            const { codigo, respuesta } = await obtenerTodasLasFacturas(facturaRepository, req.query);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async obtenerFacturaPorId(req, res) {
        // * Controlador para obtener una factura por su ID, se encarga de recibir
        // * el ID de la factura por parametro y llamar al caso de uso
        // * "obtenerFacturaPorId" y devolver su respuesta
        try {
            const id = req.params.id
            const { codigo, respuesta } = await obtenerFacturaPorId(id, facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    async obtenerFacturaDetallada(req, res) {
        // * Controlador para obtener una factura detallada ,
        // * recibe la serie, correlativo, ruc y tipo del documento de la factura por parametro y llamar al caso de uso
        // * "obtenerFacturaDetallada" y devolver su respuesta
        try {
            const { codigo, respuesta } = await obtenerFacturaDetallada(req.body, facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    async crearFactura(req, res) {
        // * Controlador para crear una factura, se encarga de recibir
        // * los datos de la factura por body y llamar al caso de uso
        // * "crearFactura" y devolver su respuesta
        // * si en el body, manda id de borrador, se creara la factura a partir del borrador
        // * pero se elimina el borrador del cual se creo
        try {
            const { codigo, respuesta } = await crearFactura(req.body, facturaRepository, borradorRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    async verificarCorrelativoRegistrado(req, res) {
        // * Controlador para obtener el correlativo de la factura
        // * se encarga de llamar al caso de uso
        // * "obtenerCorrelativo" y devolver su respuesta
        try {
            const { codigo, respuesta } = await verificarCorrelativoRegistrado(req.body, facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },

    async obtenerCorrelativo(req, res) {
        // * Controlador para obtener el correlativo de la factura
        // * se encarga de llamar al caso de uso
        // * "obtenerCorrelativo" y devolver su respuesta
        try {
            const { codigo, respuesta } = await obtenerCorrelativo(req.body, facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },

    async obtenerCorrelativoPendientes(req, res) {
        // * Controlador para obtener el correlativo de la factura
        // * se encarga de llamar al caso de uso
        // * "obtenerCorrelativo" y devolver su respuesta
        try {
            const { codigo, respuesta } = await obtenerCorrelativoPendientes(req.body, facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },

    async anularFactura(req, res) {
        // * Controlador para anular una factura
        // * se encarga de llamar al caso de uso
        // * "anularFactura" y devolver su respuesta
        try {
            const { codigo, respuesta } = await anularFactura(req.body, facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },

    async reporteVentas(req, res) {
        // * Controlador para emitir un reporte de ventas de facturas - boletas - guias - notas
        // * se encarga de llamar al caso de uso
        // * "reporteVentas" y devolver su respuesta
        try {
            const { codigo, respuesta } = await reporteVentas(req.body, facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },


    async reporteDasboard(req, res) {
        // * Controlador para emitir un reporte de dashboard de facturas - boletas - guias - notas
        // * se encarga de llamar al caso de uso
        // * "reporteDasboard" y devolver su respuesta
        try {
            const { codigo, respuesta } = await reporteDasboard(req.body, facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },

    async documentosPendientes(_, res) {
        // * Controlador para emitir un reporte de ventas de facturas - boletas - guias - notas
        // * se encarga de llamar al caso de uso
        // * "reporteVentas" y devolver su respuesta
        try {
            const { codigo, respuesta } = await documentosPendientes( facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },

    async obtenerCdrZip(req, res) {
        try {
            const { codigo, respuesta } = await obtenerCdrZip(req.body, facturaRepository)
            res.status(codigo).json(respuesta)
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false })
        }
    },
    // !!! PLAYWRIGHT
    async obtenerMTCconRuc(req, res) {
        // * Controlador para obtener el MTC para las guia de remision
        try {
            const { ruc } = req.query;
            const { codigo, respuesta } = await obtenerMTC(ruc);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },
    async obtenerRelacionesFacturas(req, res) {
        try {
            const { codigo, respuesta } = await obtenerFacturasPorRuc(req.body, facturaRepository);
            res.status(codigo).json(respuesta);
        } catch (error) {
            res.status(500).json({ error: error.message, estado: false });
        }
    },
}

module.exports = facturaController;