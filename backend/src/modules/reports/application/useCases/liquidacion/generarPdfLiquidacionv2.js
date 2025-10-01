
const db = require('../../../../../database/models');
const { liquidacionTemplatev2 } = require('../../../domain/pdfModels/liquidacion/liquidacionTemplatev2');
const { PdfService } = require('../../../infrastructure/pdf/PdfService');

module.exports = async (baja_trabajador_id, darBajaTrabajadoresRepository) => {

     const transaction = await db.sequelize.transaction(); // Iniciar transacción
    try {
    // ? buscamos la factura
    console.log('baja_trabajador_id', baja_trabajador_id);
    const informacionLiquidacion = await darBajaTrabajadoresRepository.obtenerInformacionPdfLiquidacionv2(baja_trabajador_id, transaction);

    console.log('informacionLiquidacion', informacionLiquidacion);

    if (!informacionLiquidacion.respuesta.liquidacion) {
         await transaction.rollback(); // ❌ Deshacer todo si algo falla
        return { codigo: 404, respuesta: { error: 'Liquidacion no encontrada' } };
    }

    const liquidacionData = informacionLiquidacion?.respuesta?.liquidacion || {};
    const liquidacionTrabajador = liquidacionData.get({ plain: true });

    console.log('liquidacionTrabajador', liquidacionTrabajador);

    // 2. Armar modelo PDF
    const docDefinition = await liquidacionTemplatev2(liquidacionTrabajador);

    // 3. Generar PDF con servicio
    const pdfService = new PdfService();
    const pdfBuffer = await pdfService.generatePdfBuffer(docDefinition);


    await transaction.commit(); // si todo fue bien

    // 4. Respuesta al controller
    return {
        codigo: 200,
        respuesta: {
            success: true,
            message: 'Pdf de la liquidacion generada correctamente',
            liquidacion: liquidacionTrabajador,
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