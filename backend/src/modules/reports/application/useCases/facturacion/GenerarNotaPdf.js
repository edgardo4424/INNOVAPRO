const { PdfService } = require('../../../infrastructure/pdf/PdfService');
const { notaTemplate } = require('../../../domain/pdfModels/facturacion/notaTemplate');

module.exports = async (body, notaRepository) => {

    // ? destructuramos el body
    const { correlativo, serie, numRuc, tipoDoc } = body;
    // ? buscamos la factura
    const notaObtenida = await notaRepository.obtenerNotaDetallada(correlativo, serie, numRuc, tipoDoc);
    console.log("desde reporte", notaObtenida);
    if (!notaObtenida) {
        return { codigo: 404, respuesta: { error: 'Nota no encontrada' } };
    }

    // ? 2. Armar modelo PDF
    const docDefinition = notaTemplate(notaObtenida);

    // ? 3. Generar PDF con servicio
    const pdfService = new PdfService();
    const pdfBuffer = await pdfService.generatePdfBuffer(docDefinition);


    // ? 4. Respuesta al controller
    return {
        codigo: 200,
        respuesta: {
            success: true,
            message: 'Factura generada correctamente',
            pdf: pdfBuffer.toString('base64'),
        },
    };
};