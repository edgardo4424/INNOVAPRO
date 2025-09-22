
const SequelizeDarBajaTrabajadorRepository = require('../../../dar_baja_trabajadores/infrastructure/repositories/sequelizeDarBajaTrabajadorRepository');
const darBajaTrabajadoresRepository = new SequelizeDarBajaTrabajadorRepository()

const generarPdfLiquidacion = require('../../application/useCases/liquidacion/generarPdfLiquidacion');

const liquidacionReporteController = {
    async generarPdfLiquidacion(req, res) {
        // *Controllador que recibe los campos, serie,correlativo,tipo de documento y
        // *ruc para generar el reporte en pdf de esta factura
        try {
            const { id } = req.params
            const { codigo, respuesta } = await generarPdfLiquidacion(id, darBajaTrabajadoresRepository)
            if (!respuesta.success) {
                return res.status(codigo).json(respuesta);
            }

            const pdfBuffer = Buffer.from(respuesta.pdf, 'base64');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="factura.pdf"');
            res.send(pdfBuffer);
        } catch (error) {
            console.log('error', error);
            res.status(500).json({ error: error.message })
        }
    }

}

module.exports = liquidacionReporteController;