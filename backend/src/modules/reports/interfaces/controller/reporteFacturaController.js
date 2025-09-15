const GenerateFacturaPdf = require('../../application/useCases/facturacion/GenerateFacturaPdf')
const GenerarGuiaPdf = require('../../application/useCases/facturacion/GenerarGuiaPdf')
const SequelizeFacturaRepository = require('../../../facturacion/infrastructure/repositories/sequelizeFacturaRepository')
const SequelizeGuiaRepository = require('../../../facturacion/infrastructure/repositories/sequelizeGuiaRemisionRepository')

const facturaRepository = new SequelizeFacturaRepository()
const guiaRepository = new SequelizeGuiaRepository()

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
            res.setHeader('Content-Disposition', 'inline; filename="factura.pdf"');
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },

}

module.exports = reporteFacturaController;