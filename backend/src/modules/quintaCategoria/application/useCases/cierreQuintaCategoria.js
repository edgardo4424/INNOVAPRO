const db = require("../../../../database/models");

module.exports = async (
  usuario_cierre_id,
  periodo,
  filial_id,
  quintaRepository
) => {
  const transaction = await db.sequelize.transaction();
  try {
    // Verificamos si ya está cerrado el período
    const cierreExistente = await quintaRepository.obtenerCierreQuinta(
      periodo,
      filial_id,
      transaction
    );

    if (cierreExistente && cierreExistente?.locked_at) {
      return {
        codigo: 400,
        respuesta: { mensaje: "El cálculo de quinta ya fue cerrado para este período" },
      };
    }

    let cierreId = null;

    if (cierreExistente) {
      // actualizamos el cierre existente
      await quintaRepository.actualizarCierreQuinta(
        cierreExistente.id,
        {
          locked_at: new Date(),
          usuario_cierre_id,
        },
        transaction
      );
      cierreId = cierreExistente.id;
    } else {
      // creamos un nuevo cierre
      const dataCierre = {
        filial_id,
        periodo,
        locked_at: new Date(),
        usuario_cierre_id,
      };
      const cierre = await quintaRepository.insertarCierreQuinta(
        dataCierre,
        transaction
      );
      cierreId = cierre.id;
    }

    await transaction.commit();
    return {
      codigo: 201,
      respuesta: { mensaje: "Se cerró el período de quinta categoría", cierre_id: cierreId },
    };
  } catch (error) {
    console.error("Error en cierre de quinta:", error);
    await transaction.rollback();
    return {
      codigo: 500,
      respuesta: { mensaje: "Error al realizar el cierre de quinta" },
    };
  }
};