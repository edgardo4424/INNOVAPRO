const { actualizarCuotasPagadas } = require("../../../../application/services/actualizarCuotasPagadas");
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

      console.log('graaaaaaaaaatiiiiiii', gratificaciones);

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
          data_mantenimiento_detalle: gratificaciones.data_mantenimiento_detalle
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
        data_mantenimiento_detalle: gratificaciones.data_mantenimiento_detalle
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

    const trabajadoresConGratificacionCerradas = trabajadoresConGratificacionCerrada.map(
      (gratificacion) => {
        return {
          trabajador_id: gratificacion.trabajador_id,
          fecha_ingreso: gratificacion.fecha_ingreso,
          fecha_fin: gratificacion.fecha_fin,
        }
      }
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
      return !trabajadoresConGratificacionCerradas.some((gratificacionCerrada) => {
        return (
          gratificacionCerrada.trabajador_id === gratificacion.trabajador_id &&
          gratificacionCerrada.fecha_ingreso === gratificacion.fecha_ingreso &&
          gratificacionCerrada.fecha_fin === gratificacion.fecha_fin
        );
      });
    });


    await gratificacionRepository.insertarVariasGratificaciones(
      dataGratificacionesSinCerrar,
      transaction
    );

    console.log('dataGratificacionesSinCerrar', dataGratificacionesSinCerrar);

    // Actualizar la tabla adelanto_sueldo si en caso en dataPlanillaQuincenalSinCerrar existen adelantos de sueldo
    if (dataGratificacionesSinCerrar.length > 0) {

       const dataGratificacionesSinCerrarConAdelantoSueldo = dataGratificacionesSinCerrar.filter((grati) => {
          return grati.adelanto_sueldo > 0
       })

       const adelantos_ids = dataGratificacionesSinCerrarConAdelantoSueldo.map((grati) => {
          return grati.adelantos_ids
       })

      
       await actualizarCuotasPagadas(adelantos_ids.flat(), transaction)
      }

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
