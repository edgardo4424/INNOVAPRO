const db = require("../../../../database/models");
const {
  mapearParaRegistrarTablaGratificaciones,
} = require("../../infrastructure/services/mapearParaRegistrarTablaGratificaciones");
const moment = require('moment');

module.exports = async (
  usuario_cierre_id,
  filial_id,
  trabajador_id,
  fecha_baja,
  gratificacionRepository,
  transaction = null
) => {

    let anio = moment(fecha_baja).format('YYYY');
    let mes = moment(fecha_baja).format('MM');

    // Si fecha terminacion anticipada esta dentro de la grati de julio, poner periodo = "JULIO"

    let periodo = mes <= 6 ? 'JULIO' : 'DICIEMBRE';
    
    // Verificar si ya fue generado la gratificacion para ese trabajador hasta ese momento
    
    const gratificacion_del_trabajador =
      await gratificacionRepository.obtenerGratificacionPorTrabajador(
        periodo,
        anio,
        filial_id,
        trabajador_id,
        transaction
      );

      console.log('gratificacion_del_trabajador',gratificacion_del_trabajador);

      
      let cierreId = null;


    if (gratificacion_del_trabajador.length > 0) {
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

        console.log({
          periodo,
          anio,
          filial_id,
          trabajador_id
        });
        const gratificacionesTrab =
          await gratificacionRepository.calcularGratificacionTruncaPorTrabajador(
            periodo,
            anio,
            filial_id,
            trabajador_id,
            transaction
          );

          console.log('gratificacionesTrab',gratificacionesTrab);

          const gratificacionDelTrabajador = gratificacionesTrab.planilla.trabajadores; 

        // Verificar si hay gratificaciones para registrar
        if (gratificacionDelTrabajador.length === 0) {
          return {
            codigo: 400,
            respuesta: { mensaje: "No hay gratificaciones del trabajador" },
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

 
    return {
      codigo: 201,
      respuesta: {
        mensaje: "Se registro la gratificacion del trabajador exitosamente",
      },
    };
  
};
