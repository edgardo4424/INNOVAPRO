const ID_ESTADO_COTIZACION_CREADO = 1;

module.exports = async (cotizacionData, cotizacionRepository) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción

  try {
    const {
      uso_id,
      cotizacion,
      despiece,
    } = cotizacionData;

    if (despiece.length == 0)
      return {
        codigo: 400,
        respuesta: { mensaje: "No hay piezas en el despiece." },
      };

    // 1. Buscar cotizacion por id con estado Por Aprobar (3)

      const cotizacionEncontrada = await cotizacionRepository.obtenerPorId(cotizacion.id)

      console.log('cotizacionEncontrada', cotizacionEncontrada);


    await transaction.commit(); // ✔ Confirmar todo
    return {
      codigo: 201,
      respuesta: { mensaje: "Cotización creada exitosamente" },
    };
  } catch (error) {
    await transaction.rollback(); // ❌ Deshacer todo si algo falla
    console.error("Error en creación de cotización:", error);
    return {
      codigo: 500,
      respuesta: { mensaje: "Error al crear la cotización" },
    };
  }
};
