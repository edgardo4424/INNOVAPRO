const { PdfService } = require('../../../infrastructure/pdf/PdfService');
const { facturaTemplate } = require('../../../domain/pdfModels/facturacion/facturaTemplate');

module.exports = async (body, facturaRepository) => {
    // ? destructuramos el body
    const { correlativo, serie, empresa_ruc, tipo_doc } = body;
    // ? buscamos la factura
    const facturaObtenida = await facturaRepository.obtenerFacturaPorInformacion(correlativo, serie, empresa_ruc, tipo_doc);
    console.log(facturaObtenida);
    if (!facturaObtenida) {
        return { codigo: 404, respuesta: { error: 'Factura no encontrada' } };
    }

    // 2. Armar modelo PDF
    const docDefinition = facturaTemplate(facturaObtenida);

    // 3. Generar PDF con servicio
    const pdfService = new PdfService();
    console.log("dad")
    const pdfBuffer = await pdfService.generatePdfBuffer(docDefinition);


    // 4. Respuesta al controller
    return {
        codigo: 200,
        respuesta: {
            success: true,
            message: 'Factura generada correctamente',
            pdf: pdfBuffer.toString('base64'), // puedes mandar base64 si quieres
        },
    };
};