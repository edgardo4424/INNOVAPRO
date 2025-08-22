const { where, Op } = require("sequelize");
const sequelize = require("../../../../config/db");
const { Asistencia } = require("../models/asistenciaModel");
const { Gasto } = require("../models/gastoModel");
const { Jornada } = require("../models/jornadaModel");

class SequelizeAsistenciaRepository {
   async crearAsistencia(asistenciaData) {
      const t = await sequelize.transaction();
      try {
         const asistencia = await Asistencia.create(
            {
               trabajador_id: asistenciaData.trabajador_id,
               horas_trabajadas: asistenciaData.horas_trabajadas || null,
               horas_extras: asistenciaData.horas_extras || null,
               estado_asistencia: asistenciaData.estado_asistencia,
               fecha: asistenciaData.fecha,
            },
            {
               transaction: t,
            }
         );
         if (asistenciaData.gastos && asistenciaData.gastos.length > 0) {
            for (const gasto of asistenciaData.gastos) {
               await Gasto.create(
                  {
                     asistencia_id: asistencia.id,
                     descripcion: gasto.descripcion,
                     monto: gasto.monto,
                  },
                  {
                     transaction: t,
                  }
               );
            }
         }
         if (asistenciaData.jornadas && asistenciaData.jornadas.length > 0) {
            for (const jornada of [...asistenciaData.jornadas].reverse()) {
               await Jornada.create(
                  {
                     asistencia_id: asistencia.id,
                     tipo_trabajo_id: jornada.tipo_trabajo_id,
                     turno: jornada.turno,
                     lugar: jornada.lugar,
                  },
                  {
                     transaction: t,
                  }
               );
            }
         }
         await t.commit();
      } catch (error) {
         await t.rollback();
         throw new Error(error.message);
      }
   }
   async actualizarAsistencia(asistenciaData) {
      const t = await sequelize.transaction();
      try {
         await Asistencia.update(
            {
               horas_trabajadas: asistenciaData.horas_trabajadas || null,
               horas_extras: asistenciaData.horas_extras || null,
               estado_asistencia: asistenciaData.estado_asistencia,
            },
            {
               where: {
                  id: asistenciaData.id,
               },
               transaction: t,
            }
         );
         await Gasto.destroy({
            where: {
               asistencia_id: asistenciaData.id,
            },
            transaction: t,
         });
         await Jornada.destroy({
            where: {
               asistencia_id: asistenciaData.id,
            },
            transaction: t,
         });
         if (asistenciaData.gastos && asistenciaData.gastos.length > 0) {
            for (const gasto of asistenciaData.gastos) {
               await Gasto.create(
                  {
                     asistencia_id: asistenciaData.id,
                     descripcion: gasto.descripcion,
                     monto: gasto.monto,
                  },
                  {
                     transaction: t,
                  }
               );
            }
         }
         if (asistenciaData.jornadas && asistenciaData.jornadas.length > 0) {
            for (const jornada of [...asistenciaData.jornadas].reverse()) {
               await Jornada.create(
                  {
                     asistencia_id: asistenciaData.id,
                     tipo_trabajo_id: jornada.tipo_trabajo_id,
                     turno: jornada.turno,
                     lugar: jornada.lugar,
                  },
                  {
                     transaction: t,
                  }
               );
            }
         }

         await t.commit();
      } catch (error) {
         await t.rollback();
         throw new Error(error.message);
      }
   }
   async crearAsistenciaSimple(asistenciaData) {
      try {
         const asistencia = await Asistencia.create({
            trabajador_id: asistenciaData.trabajador_id,
            horas_trabajadas: 9,
            estado_asistencia: asistenciaData.estado_asistencia,
            fecha: asistenciaData.fecha,
         });
         console.log(asistencia);
      } catch (error) {
         console.error(error);
         throw new Error(error.message);
      }
   }

   async actualizarAsistenciaSimple(asistenciaData) {
      try {
         await Asistencia.update(
            {
               estado_asistencia: asistenciaData.estado_asistencia,
            },
            {
               where: {
                  id: asistenciaData.id,
               },
            }
         );
      } catch (error) {
         throw new Error(error.message);
      }
   }

   async obtenerHorasExtrasPorRangoFecha(trabajador_id, fechaInicio, fechaFin) {
  try {

    const asistencias = await Asistencia.findAll({
      where: {
        trabajador_id,
        fecha: {
          [Op.between]: [fechaInicio, fechaFin], // <-- inclusivo en ambos extremos
        },
      },
      // Opcional: optimiza la consulta si solo necesitas horas_extras
      //attributes: ['horas_extras'],
      raw: true,
    });

    return asistencias.reduce((total, a) => total + Number(a.horas_extras || 0), 0);
  } catch (error) {
    throw new Error(error.message);
  }
}

 async obtenerCantidadFaltasPorRangoFecha(trabajador_id, fechaInicio, fechaFin) {
  try {

    const cantidadFaltas = await Asistencia.count({
      where: {
        trabajador_id,
        estado_asistencia: "falto",
        fecha: {
          [Op.between]: [fechaInicio, fechaFin], // <-- inclusivo en ambos extremos
        },
      },
    });


    return cantidadFaltas
  } catch (error) {
    throw new Error(error.message);
  }
}

 async obtenerAsistenciasPorRangoFecha(trabajador_id, fechaInicio, fechaFin) {
  try {
   console.log('inicio',fechaInicio);
   console.log('Fin',fechaFin);
   
   
    const asistencias = await Asistencia.findAll({
      where: {
        trabajador_id,
        fecha: {
          [Op.between]: [fechaInicio, fechaFin], 
        },
      },
      order: [["fecha", "ASC"]],
    });
    return asistencias
    }
    catch(error){
         console.log(error);
         
    }
   }

   async obtenerFaltasPorRangoFecha(trabajador_id, fechaInicio, fechaFin) {
  try {
   console.log('inicio',fechaInicio);
   console.log('Fin',fechaFin);
   
   
    const asistencias = await Asistencia.findAll({
      where: {
        trabajador_id,
        estado_asistencia: 'falto',
        fecha: {
          [Op.between]: [fechaInicio, fechaFin], 
        },
      },
      order: [["fecha", "ASC"]],
    });
    return asistencias
    }
    catch(error){
         console.log(error);
         
    }
   }

async obtenerDiasNoComputablesPorRangoFecha(trabajador_id, fechaInicio, fechaFin) {
  try {

    const cantidadDias = await Asistencia.count({
      where: {
        trabajador_id,
        estado_asistencia: "licencia_sin_goce",
        fecha: {
          [Op.between]: [fechaInicio, fechaFin], // <-- inclusivo en ambos extremos
        },
      },
    });


    return cantidadDias
  } catch (error) {
    throw new Error(error.message);
  }
}
}

module.exports = SequelizeAsistenciaRepository;
