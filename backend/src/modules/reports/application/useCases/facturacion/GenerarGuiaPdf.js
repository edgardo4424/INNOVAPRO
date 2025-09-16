const { PdfService } = require('../../../infrastructure/pdf/PdfService');
const {  guiaTemplate } = require('../../../domain/pdfModels/facturacion/guiaTemplate');

module.exports = async (body, guiaRepository) => {
    // ? destructuramos el body
    const { correlativo, serie, empresa_ruc, tipo_doc } = body;
    // ? buscamos la factura
    const guiaObtenida = await guiaRepository.obtenerGuiaPorInformacion(correlativo, serie, empresa_ruc, tipo_doc);
    console.log(guiaObtenida);
    if (!guiaObtenida) {
        return { codigo: 404, respuesta: { error: 'Guia no encontrada' } };
    }

    // 2. Armar modelo PDF
    const docDefinition = guiaTemplate(guiaObtenida);

    // 3. Generar PDF con servicio
    const pdfService = new PdfService();
    const pdfBuffer = await pdfService.generatePdfBuffer(docDefinition);

    // 4. Respuesta al controller
    return {
        codigo: 200,
        respuesta: {
            success: true,
            message: 'Guia generada correctamente',
            pdf: pdfBuffer.toString('base64'), // puedes mandar base64 si quieres
        },
    };
};