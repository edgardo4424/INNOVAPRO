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
    
      // Verificar si ya hay un registro en cierres_Gratificaciones
      const cierreGratificacion =
        await gratificacionRepository.obtenerCierreGratificacion(
          periodo,
          anio,
          filial_id,
          transaction
        );

      let gratificacion_trunca = null;

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
          respuesta: { mensaje: "La gratificacion ya fue cerrada", gratificacion_trunca: null },
        };
      } else {
        // Registrar la grati del trabajador
        // Calcular gratificaciones

      
        const gratificacionesTrab =
          await gratificacionRepository.calcularGratificacionTruncaPorTrabajador(
            periodo,
            anio,
            filial_id,
            trabajador_id,
            transaction
          );

       
          const gratificacionDelTrabajador = gratificacionesTrab.planilla.trabajadores; 

        // Verificar si hay gratificaciones para registrar
        if (gratificacionDelTrabajador.length === 0) {
          return {
            codigo: 400,
            respuesta: { mensaje: "No hay gratificaciones del trabajador", gratificacion_trunca: null },
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

        console.log('dataGratificaciones', dataGratificaciones);


       gratificacion_trunca = await gratificacionRepository.insertarVariasGratificaciones(
          dataGratificaciones,
          transaction
        );

      }

    return {
      codigo: 201,
      respuesta: {
        mensaje: "Se registro la gratificacion del trabajador exitosamente",
        gratificacion_trunca: gratificacion_trunca ? gratificacion_trunca[0].dataValues : null
      },
    };
  
};
