const db = require("../../../../database/models");
const {
  mapearParaRegistrarTablaGratificaciones,
} = require("../../infrastructure/services/mapearParaRegistrarTablaGratificaciones");

module.exports = async (
  usuario_cierre_id,
  periodo,
  anio,
  filial_id,
  trabajador_id,
  gratificacionRepository
  /* transaction = null */
) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción
  try {
    // Validar periodo
    if (!["JULIO", "DICIEMBRE"].includes(periodo)) {
      return { codigo: 400, respuesta: { mensaje: "Periodo inválido" } };
    }

    // Verificar si ya fue generado la gratificacion para ese trabajador hasta ese momento

    const gratificacionDelTrabajador =
      await gratificacionRepository.obtenerGratificacionPorTrabajador(
        periodo,
        anio,
        filial_id,
        trabajador_id,
        transaction
      );

    if (gratificacionDelTrabajador && gratificacionDelTrabajador?.locked_at) {
      return {
        codigo: 400,
        respuesta: {
          mensaje: "La gratificacion ya fue cerrada para ese trabajador",
        },
      };
    } else {
      // Si no fue cerrada, cerrarla

      // Verificar si ya hay un registro en cierres_Gratificaciones
      const cierreGratificacion =
        await gratificacionRepository.obtenerCierreGratificacion(
          periodo,
          anio,
          filial_id,
          transaction
        );

      let cierreId = null;

      if (!cierreGratificacion) {
        // Registrar el registro de la tabla cierres_gratificaciones
        // Crear registro de cierre
        const dataCierreGratificacion = {
          filial_id,
          periodo: `${anio}-${periodo === "JULIO" ? "07" : "12"}`, // ejemplo de mapeo
          locked_at: null, // loced_at en null porque solo se va a cerrar la gratificacion del un trabajador
          usuario_cierre_id,
        };

        const nuevoCierreGrati =
          await gratificacionRepository.insertarCierreGratificacion(
            dataCierreGratificacion,
            transaction
          );

        cierreId = nuevoCierreGrati.id;
      } else {
        cierreId = cierreGratificacion.id;
      }

      if (cierreGratificacion?.locked_at) {
        return {
          codigo: 400,
          respuesta: { mensaje: "La gratificacion ya fue cerrada" },
        };
      } else {
        // Registrar la grati del trabajador
        // Calcular gratificaciones
        const gratificaciones =
          await gratificacionRepository.calcularGratificaciones(
            periodo,
            anio,
            filial_id,
            transaction
          );

        // Verificar si hay gratificaciones para registrar
        if (gratificaciones.planilla.trabajadores.length === 0) {
          return {
            codigo: 400,
            respuesta: { mensaje: "No hay gratificaciones para calcular" },
          };
        }

        // Obtener solo la grati del trabajador
        const gratificacionDelTrabajador =
          gratificaciones.planilla.trabajadores.filter((gratificacion) => {
            return gratificacion.trabajador_id == trabajador_id;
          });

        // Verificar si hay gratificaciones para registrar
        if (gratificacionDelTrabajador.length === 0) {
          return {
            codigo: 400,
            respuesta: {
              mensaje: "No se encontró la gratificacion del trabajador",
            },
          };
        }

        const dataGratificaciones = mapearParaRegistrarTablaGratificaciones(
          gratificacionDelTrabajador,
          periodo,
          anio,
          filial_id,
          usuario_cierre_id,
          cierreId
        );

        await gratificacionRepository.insertarVariasGratificaciones(
          dataGratificaciones,
          transaction
        );
      }
    }
    await transaction.commit(); // ✔ Confirmar transacción

    return {
      codigo: 201,
      respuesta: {
        mensaje: "Se registro la gratificacion del trabajador exitosamente",
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
