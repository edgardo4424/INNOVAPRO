const db = require("../../../../database/models");
const {
  mapearParaRegistrarTablaGratificaciones,
} = require("../../infrastructure/services/mapearParaRegistrarTablaGratificaciones");

module.exports = async (
  usuario_cierre_id,
  periodo,
  anio,
  filial_id,
  gratificacionRepository
  /* transaction = null */
) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción
  try {
    // Validar periodo
    if (!["JULIO", "DICIEMBRE"].includes(periodo)) {
      return { codigo: 400, respuesta: { mensaje: "Periodo inválido" } };
    }

    // Verificar si ya fue generado la gratificacion
    const gratificacionCerrada =
      await gratificacionRepository.obtenerCierreGratificacion(
        periodo,
        anio,
        filial_id
      );

    console.log("gratificacionCerrada", gratificacionCerrada);

    if (gratificacionCerrada && gratificacionCerrada?.locked_at) {
      return {
        codigo: 400,
        respuesta: { mensaje: "La gratificacion ya fue cerrada" },
      };
    }

    // Calcular gratificaciones
    const gratificaciones =
      await gratificacionRepository.calcularGratificaciones(
        periodo,
        anio,
        filial_id
      );

    // Verificar si hay gratificaciones para registrar
    if (gratificaciones.planilla.trabajadores.length === 0) {
      return {
        codigo: 400,
        respuesta: { mensaje: "No hay gratificaciones para calcular" },
      };
    }

    let cierre_id = null;

    if (gratificacionCerrada) {

      cierre_id = gratificacionCerrada.id

      await gratificacionRepository.actualizarCierreGratificacion(
        cierre_id,
        {
          locked_at: new Date(),
          usuario_cierre_id,
        },
        transaction
      );

    } else {
      
// Crear registro de cierre
      const dataCierreGratificacion = {
        filial_id,
        periodo: `${anio}-${periodo === "JULIO" ? "07" : "12"}`, // ejemplo de mapeo
        locked_at: new Date(),
        usuario_cierre_id,
      };

      const cierre = await gratificacionRepository.insertarCierreGratificacion(
        dataCierreGratificacion,
        transaction
      );

      cierre_id = cierre.dataValues.id; // ← importante para mapear
    }

    // Verificar primero que gratificaciones del trabajador ya fue cerrada

    const trabajadoresConGratificacionCerrada =
      await gratificacionRepository.obtenerGratificacionesCerradas(
        periodo,
        anio,
        filial_id
      );

      console.log('trabajadoresConGratificacionCerrada', trabajadoresConGratificacionCerrada);

    const trabajadoresConGratificacionCerradaIds = trabajadoresConGratificacionCerrada.map(
      (gratificacion) => gratificacion.trabajador_id
    );

    // Mapear y registrar gratificaciones
    const dataGratificaciones = mapearParaRegistrarTablaGratificaciones(
      gratificaciones.planilla.trabajadores,
      periodo,
      anio,
      filial_id,
      usuario_cierre_id,
      cierre_id
    );

    const dataGratificacionesSinCerrar = dataGratificaciones.filter((gratificacion) => {
      return !trabajadoresConGratificacionCerradaIds.includes(gratificacion.trabajador_id);
    });

    console.log('dataGratificacionesSinCerrar', dataGratificacionesSinCerrar);

    await gratificacionRepository.insertarVariasGratificaciones(
      dataGratificacionesSinCerrar,
      transaction
    );

    await transaction.commit(); // ✔ Confirmar transacción

    return {
      codigo: 201,
      respuesta: {
        mensaje:
          "Se registraron las gratificaciones para ese periodo exitosamente",
      },
    };
  } catch (error) {
    console.error("Error en cierre de gratificaciones:", error);
    await transaction.rollback(); // ❌ Deshacer todo si algo falla
    return {
      codigo: 500,
      respuesta: { mensaje: "Error al realizar el cierre de gratificaciones" },
    };
  }
};
