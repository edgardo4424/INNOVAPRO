const GenerateFacturaPdf = require('../../application/useCases/facturacion/GenerateFacturaPdf')
const GenerarGuiaPdf = require('../../application/useCases/facturacion/GenerarGuiaPdf')
const SequelizeFacturaRepository = require('../../../facturacion/infrastructure/repositories/sequelizeFacturaRepository')
const SequelizeGuiaRepository = require('../../../facturacion/infrastructure/repositories/sequelizeGuiaRemisionRepository')
const SequelizeNotaRepository = require('../../../facturacion/infrastructure/repositories/sequelizeNotasCreditoDebito')
const GenerarNotaPdf = require('../../application/useCases/facturacion/GenerarNotaPdf')

const facturaRepository = new SequelizeFacturaRepository()
const guiaRepository = new SequelizeGuiaRepository()
const notaRepository = new SequelizeNotaRepository()

const reporteFacturaController = {
    async reporteFactura(req, res) {
        // *Controllador que recibe los campos, serie,correlativo,tipo de documento y
        // *ruc para generar el reporte en pdf de esta factura
        try {
            const { codigo, respuesta } = await GenerateFacturaPdf(req.body, facturaRepository)
            if (!respuesta.success) {
                return res.status(codigo).json(respuesta);
            }

            const pdfBuffer = Buffer.from(respuesta.pdf, 'base64');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="factura.pdf"');
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    async reporteGuia(req, res) {
        // *Controllador que recibe los campos, serie,correlativo,tipo de documento y
        // *ruc para generar el reporte en pdf de esta guia
        try {
            const { codigo, respuesta } = await GenerarGuiaPdf(req.body, guiaRepository)
            if (!respuesta.success) {
                return res.status(codigo).json(respuesta);
            }

            const pdfBuffer = Buffer.from(respuesta.pdf, 'base64');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="guia.pdf"');
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

    async reporteNota(req, res) {
        // *Controllador que recibe los campos, serie,correlativo,tipo de documento y
        // *ruc para generar el reporte en pdf de esta nota (credito o debito)
        try {
            const { codigo, respuesta } = await GenerarNotaPdf(req.body, notaRepository)
            if (!respuesta.success) {
                return res.status(codigo).json(respuesta);
            }

            const pdfBuffer = Buffer.from(respuesta.pdf, 'base64');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="nota.pdf"');
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

}

module.exports = reporteFacturaController;