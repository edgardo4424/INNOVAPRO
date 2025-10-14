const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const {
  Trabajador,
} = require("../../../trabajadores/infraestructure/models/trabajadorModel");
const { Vacaciones } = require("../models/vacacionesModel");
const SequelizeDataMantenimientoRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");
const { Op } = require("sequelize");
const filtrarContratosSinInterrupcion = require("../../../../services/filtrarContratosSinInterrupcion");
const {
  AsistenciaVacaciones,
} = require("../models/asistenciasVacacionesModel");

const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

class SequelizeVacacionesRepository {
  async crear(vacacionesData, transaction = null) {
    const options = {};
    if (transaction) {
      options.transaction = transaction;
    }
    const vacaciones = await Vacaciones.create(vacacionesData, options);
    return vacaciones.get({ plain: true });
  }

  async crearVacacionesXasitencias(asistencias_vacaciones, transaction = null) {
    const options = {};
    if (transaction) {
      options.transaction = transaction;
    }
    const vacacionesXasistencias = await AsistenciaVacaciones.create(
      asistencias_vacaciones,
      options
    );

    return vacacionesXasistencias.get({ plain: true });
  }

  async obtenerVacacionesTrabajadores() {
    const trabajadoresXvacaciones = await Trabajador.findAll({
      include: [
        {
          model: db.vacaciones,
          as: "vacaciones",
          required: false,
        },
        {
          model: db.cargos,
          as: "cargo",
          include: [
            {
              model: db.areas,
              as: "area",
            },
          ],
        },
        {
          model: db.contratos_laborales,
          as: "contratos_laborales",
          where: { estado: 1 },
          include: {
            model: db.empresas_proveedoras,
            as: "empresa_proveedora",
          },
        },
      ],
    });
    const trabajadoreslimpios = trabajadoresXvacaciones.map((t) =>
      t.get({ plain: true })
    );

    const dataValidada = await Promise.all(
      trabajadoreslimpios.map(async (t) => {
        const data = { ...t };
        const { vacaciones, contratos_laborales } = data;
        const contratos_limpios =
          filtrarContratosSinInterrupcion(contratos_laborales);
        // !Rangos para filtrar las vacaciones
        const fecha_inicio = contratos_limpios[0].fecha_inicio;
        const fecha_fin =
          contratos_limpios[contratos_limpios.length - 1].fecha_fin;
        const vacaciones_limpias = vacaciones.filter((v) => {
          return (
            v.fecha_inicio >= fecha_inicio &&
            v.fecha_inicio <= fecha_fin &&
            v.estado === "aprobada"
          );
        });
        data.vacaciones = vacaciones_limpias;
        data.contratos_laborales = contratos_limpios;
        data.vacaciones = await Promise.all(
          data.vacaciones.map(async (v) => {
            let datos = { ...v };
            datos.dias_tomados = 0;
            datos.dias_vendidos = 0;
            const responseAsistencia = await AsistenciaVacaciones.findAll({
              where: { vacaciones_id: v.id },
            });
            const limpiar_response = responseAsistencia.map((r) => {
              if (r.tipo == "gozada") {
                datos.dias_tomados++;
              }
              if (r.tipo == "vendida") {
                datos.dias_vendidos++;
              }
              return r.get({ plain: true });
            });
            datos.asitencias = limpiar_response;
            return datos;
          })
        );
        return data;
      })
    );
    return dataValidada.reverse();
  }
  async obtenerVacacionesPorTrabajadorId(
    inicio,
    fin,
    trabajador_id,
    transaction = null
  ) {
    const options = {
      where: {
        trabajador_id,
        [Op.or]: [
          {
            fecha_inicio: {
              [Op.between]: [inicio, fin],
            },
          },
          {
            fecha_termino: {
              [Op.between]: [inicio, fin],
            },
          },
        ],
      },
      order: [["fecha_termino", "ASC"]],
    };

    if (transaction) {
      options.transaction = transaction;
    }
    return await db.vacaciones.findAll(options);
  }

  async obtenerCantidadDiasVacacionesGozadas(
    trabajador_id,
    fecha_inicio,
    fecha_fin,
    transaction = null
  ) {
    const cantidadVacaciones = db.asistencias.count({
      where: {
        trabajador_id,
        estado_asistencia: "vacacion-gozada",
        fecha: {
          [Op.between]: [fecha_inicio, fecha_fin],
        },
      },
    }, { transaction });
    return cantidadVacaciones;
  }
}

module.exports = SequelizeVacacionesRepository;
