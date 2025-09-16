
const { liquidacionTemplate } = require('../../../domain/pdfModels/liquidacion/liquidacionTemplate');
const { PdfService } = require('../../../infrastructure/pdf/PdfService');

module.exports = async (baja_trabajador_id, darBajaTrabajadoresRepository) => {

     const transaction = await db.sequelize.transaction(); // Iniciar transacción
    try {
    // ? buscamos la factura
    const informacionLiquidacion = await darBajaTrabajadoresRepository.obtenerInformacionPdfLiquidacion(baja_trabajador_id, transaction);

    console.log('informacionLiquidacion', informacionLiquidacion);

    if (!informacionLiquidacion) {
        return { codigo: 404, respuesta: { error: 'Liquidacion no encontrada' } };
    }

    // 2. Armar modelo PDF
    const docDefinition = liquidacionTemplate(facturaObtenida);

    // 3. Generar PDF con servicio
    const pdfService = new PdfService();
    const pdfBuffer = await pdfService.generatePdfBuffer(docDefinition);

    // 4. Respuesta al controller
    return {
        codigo: 200,
        respuesta: {
            success: true,
            message: 'Pdf de la liquidacion generada correctamente',
            pdf: pdfBuffer.toString('base64'), // puedes mandar base64 si quieres
        },
    };
    } catch (error) {
          console.error("Error al generar el pdf de liquidacion", error);
    await transaction.rollback(); // ❌ Deshacer todo si algo falla
    return {
      codigo: 500,
      respuesta: { mensaje: "Error al generar el pdf de liquidacion" },
    };
    }
    
};