const { where, Op } = require("sequelize");
const sequelize = require("../../../../config/db");
const { Asistencia } = require("../models/asistenciaModel");
const { Gasto } = require("../models/gastoModel");
const { Jornada } = require("../models/jornadaModel");
const {
  AsistenciaVacaciones,
} = require("../../../vacaciones/infraestructure/models/asistenciasVacacionesModel");

class SequelizeAsistenciaRepository {
  async crearAsistencia(asistenciaData) {
    const t = await sequelize.transaction();
    try {
      const estado_asistencia_values = ["vacacion-gozada", "vacacion-vendida"];
      if (estado_asistencia_values.includes(asistenciaData.estado_asistencia)) {
        throw new Error("No se pueden crear vacaciones desde este módulo");
      }
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
        for (const jornada of [...asistenciaData.jornadas]) {
          if(!jornada.turno||!jornada.lugar||!jornada.tipo_trabajo_id){
              throw new Error("Complete los datos correctamente")
          }
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
  async verificarAsistenciaPorTrabajadorFecha(
    trabajador_id,
    fecha,
    transaction
  ) {
    const asistencia = await Asistencia.findOne({
      where: {
        trabajador_id,
        fecha: fecha,
      },
      transaction,
    });
    if (asistencia) {
      return asistencia.get({ plain: true });
    }
    return null;
  }
  async actualizarAsistencia(asistenciaData) {
    const t = await sequelize.transaction();
    try {
      const asistencia_previa = await Asistencia.findByPk(asistenciaData.id, {
        transaction: t,
      });
      if (!asistencia_previa) {
        throw new Error("No existe una asistencia para poder actualizar");
      }
      // prettier-ignore
      const estado_asistencia_values = ["vacacion-gozada","vacacion-vendida"];

      // prettier-ignore
      // !En el primer if se esta validadndo que alguna de las asistencias(previas o actual) tengo un estado de vacacion
      if (estado_asistencia_values.includes(asistenciaData.estado_asistencia)||estado_asistencia_values.includes(asistencia_previa.estado_asistencia)) {
            //! Este valiacacion, es si de una asistencia normal quieres pasarla a una asistencia con estado de vacación
               if (estado_asistencia_values.includes(asistenciaData.estado_asistencia)&&!estado_asistencia_values.includes(asistencia_previa.estado_asistencia)){
                     throw new Error("No se pueden agregar vacaciones desde este modulo")
               }
            // !Esta validacion es si: quieres pasar una asistencia con estado de vacacion a un estado normal, se tiene que elimianr del registro de "ASISTENCIAS-VACACIONES"
               if (!estado_asistencia_values.includes(asistenciaData.estado_asistencia)&&estado_asistencia_values.includes(asistencia_previa.estado_asistencia)){
                     await AsistenciaVacaciones.destroy({where:{asistencia_id:asistencia_previa.id},transaction:t});
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
               }
               else{
                  let tipo="";
                  if(asistenciaData.estado_asistencia=="vacacion-gozada")tipo="gozada" ;
                  if(asistenciaData.estado_asistencia=="vacacion-vendida")tipo="vendida";
                  await AsistenciaVacaciones.update({tipo:tipo},{where:{asistencia_id:asistencia_previa.id},transaction:t})
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
               }
         }else{
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
         }

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
        for (const jornada of [...asistenciaData.jornadas]) {
          if(!jornada.turno||!jornada.lugar||!jornada.tipo_trabajo_id){
              throw new Error("Complete los datos correctamente")
          }
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
      const estado_asistencia_values = ["vacacion-gozada", "vacacion-vendida"];
      if (estado_asistencia_values.includes(asistenciaData.estado_asistencia)) {
        throw new Error("No se pueden crear vacaciones desde este módulo");
      }
      await Asistencia.create({
        trabajador_id: asistenciaData.trabajador_id,
        horas_trabajadas: 9,
        estado_asistencia: asistenciaData.estado_asistencia,
        fecha: asistenciaData.fecha,
      });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async actualizarAsistenciaSimple(asistenciaData) {
    const t = await sequelize.transaction();
    try {
      const asistencia_previa = await Asistencia.findByPk(asistenciaData.id, {
        transaction: t,
      });
      if (!asistencia_previa) {
        throw new Error("No existe una asistencia para poder actualizar");
      }
      const estado_asistencia_values = ["vacacion-gozada", "vacacion-vendida"];
      if (
        estado_asistencia_values.includes(asistenciaData.estado_asistencia) ||
        estado_asistencia_values.includes(asistencia_previa.estado_asistencia)
      ) {
        //! Este valiacacion, es si de una asistencia normal quieres pasarla a una asistencia con estado de vacación
        if (
          estado_asistencia_values.includes(asistenciaData.estado_asistencia) &&
          !estado_asistencia_values.includes(
            asistencia_previa.estado_asistencia
          )
        ) {
          throw new Error("No se pueden agregar vacaciones desde este modulo");
        }
        // !Esta validacion es si: quieres pasar una asistencia con estado de vacacion a un estado normal, se tiene que elimianr del registro de "ASISTENCIAS-VACACIONES"
        if (
          !estado_asistencia_values.includes(
            asistenciaData.estado_asistencia
          ) &&
          estado_asistencia_values.includes(asistencia_previa.estado_asistencia)
        ) {
          await AsistenciaVacaciones.destroy({
            where: { asistencia_id: asistencia_previa.id },
            transaction: t,
          });
          await Asistencia.update(
            {
              estado_asistencia: asistenciaData.estado_asistencia,
            },
            {
              where: {
                id: asistenciaData.id,
              },
              transaction: t,
            }
          );
        } else {
          let tipo = "";
          if (asistenciaData.estado_asistencia == "vacacion-gozada")
            tipo = "gozada";
          if (asistenciaData.estado_asistencia == "vacacion-vendida")
            tipo = "vendida";
          await AsistenciaVacaciones.update(
            { tipo: tipo },
            { where: { asistencia_id: asistencia_previa.id }, transaction: t }
          );
          await Asistencia.update(
            {
              estado_asistencia: asistenciaData.estado_asistencia,
            },
            {
              where: {
                id: asistenciaData.id,
              },
              transaction: t,
            }
          );
        }
      } else {
        await Asistencia.update(
          {
            estado_asistencia: asistenciaData.estado_asistencia,
          },
          {
            where: {
              id: asistenciaData.id,
            },
            transaction: t,
          }
        );
      }
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new Error(error.message);
    }
  }

  async crearAsistenciaDeTipoVacaciones(asistenciaData, transaction = null) {
    const options = {};
    if (transaction) {
      options.transaction = transaction;
    }
    const asistencia = await Asistencia.create(
      {
        trabajador_id: asistenciaData.trabajador_id,
        horas_trabajadas: 0,
        estado_asistencia: asistenciaData.estado_asistencia,
        fecha: asistenciaData.fecha,
      },
      options
    );
    const parse = asistencia.get({ plain: true });
    return parse;
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

      return asistencias.reduce(
        (total, a) => total + Number(a.horas_extras || 0),
        0
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async obtenerCantidadFaltasPorRangoFecha(
    trabajador_id,
    fechaInicio,
    fechaFin
  ) {
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

      return cantidadFaltas;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async obtenerAsistenciasPorRangoFecha(trabajador_id, fechaInicio, fechaFin) {
    try {
      const asistencias = await Asistencia.findAll({
        where: {
          trabajador_id,
          fecha: {
            [Op.between]: [fechaInicio, fechaFin],
          },
        },
        order: [["fecha", "ASC"]],
      });
      return asistencias;
    } catch (error) {
      console.log(error);
    }
  }

  async obtenerFaltasPorRangoFecha(trabajador_id, fechaInicio, fechaFin) {
    try {
      const asistencias = await Asistencia.findAll({
        where: {
          trabajador_id,
          estado_asistencia: "falto",
          fecha: {
            [Op.between]: [fechaInicio, fechaFin],
          },
        },
        order: [["fecha", "ASC"]],
      });
      return asistencias;
    } catch (error) {
      console.log(error);
    }
  }

  async obtenerDiasNoComputablesPorRangoFecha(
    trabajador_id,
    fechaInicio,
    fechaFin
  ) {
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

      return cantidadDias;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async obtenerCantidadFaltasJustificadas(
    trabajador_id,
    fechaInicio,
    fechaFin
  ) {
    try {
      const cantidadFaltas = await Asistencia.count({
        where: {
          trabajador_id,
          estado_asistencia: "falta-justificada",
          fecha: {
            [Op.between]: [fechaInicio, fechaFin], // <-- inclusivo en ambos extremos
          },
        },
      });

      return cantidadFaltas;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async obtenerCantidadLicenciaConGoce(trabajador_id, fechaInicio, fechaFin) {
    try {
      const cantidadFaltas = await Asistencia.count({
        where: {
          trabajador_id,
          estado_asistencia: "licencia_con_goce",
          fecha: {
            [Op.between]: [fechaInicio, fechaFin], // <-- inclusivo en ambos extremos
          },
        },
      });

      return cantidadFaltas;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async obtenerCantidadLicenciaSinGoce(trabajador_id, fechaInicio, fechaFin) {
    try {
      const cantidadFaltas = await Asistencia.count({
        where: {
          trabajador_id,
          estado_asistencia: "licencia_sin_goce",
          fecha: {
            [Op.between]: [fechaInicio, fechaFin], // <-- inclusivo en ambos extremos
          },
        },
      });

      return cantidadFaltas;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async obtenerCantidadTardanzasPorRangoFecha(
    trabajador_id,
    fechaInicio,
    fechaFin
  ) {
    try {
      const cantidadTardanzas = await Asistencia.count({
        where: {
          trabajador_id,
          estado_asistencia: "tardanza",
          fecha: {
            [Op.between]: [fechaInicio, fechaFin], // <-- inclusivo en ambos extremos
          },
        },
      });

      return cantidadTardanzas;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // TODO: OJOO!!: Este su utizara solo para pasar de un estado normal a vacaciones en el caso de uso crear vacaciones

  async actualizarEstadoAsistenciaPorId(id, estado, transaction) {
    await Asistencia.update(
      {
        estado_asistencia: estado,
      },
      {
        where: { id },
        transaction,
      }
    );
    const asistenciaActualizada = await Asistencia.findByPk(id, {
      transaction,
    });
    return asistenciaActualizada.get({ plain: true });
  }
}

module.exports = SequelizeAsistenciaRepository;
