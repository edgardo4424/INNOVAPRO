const { Op } = require("sequelize");
const db = require("../../../../database/models");
const filtrarContratosSinInterrupcion = require("../../../../services/filtrarContratosSinInterrupcion");
const {
   Trabajador,
} = require("../../../trabajadores/infraestructure/models/trabajadorModel");
const SequelizeTrabajadorRepository = require("../../../trabajadores/infraestructure/repositories/sequelizeTrabajadorRepository");
const Vacaciones = require("../../domain/entities/vacaciones");
const {
   obtenerImporteDiasVendidos,
} = require("../../infraestructure/services/contratoLaboralActual");
const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const trabajadorRepository = new SequelizeTrabajadorRepository();
const asistenciaRepository = new SequelizeAsistenciaRepository();

module.exports = async (
   vacacionesData,
   vacacionesRepository,
   transaction = null
) => {
   const responseTrabajador = await trabajadorRepository.obtenerTrabajadorPorId(
      vacacionesData.trabajador_id,
      transaction
   );
   if (!responseTrabajador) {
      return {
         codigo: 400,
         respuesta: {
            mensaje: "El trabajador enviado no existe",
         },
      };
   }
   if (vacacionesData.vacacionesXasistencias.length < 1) {
      return {
         codigo: 400,
         respuesta: {
            mensaje: "No se han enviado los dias de vacaciones",
         },
      };
   }
   const trabajador = responseTrabajador;
   const contratos_sin_interrupcion = filtrarContratosSinInterrupcion(
      trabajador.contratos_laborales
   );
   const fecha_inicio = contratos_sin_interrupcion[0].fecha_inicio;
   const fecha_fin =
      contratos_sin_interrupcion[contratos_sin_interrupcion.length - 1]
         .fecha_fin;

   const responseVacaciones = await db.vacaciones.findAll({
      where: {
         trabajador_id: trabajador.id,
         estado: "aprobada",
         fecha_inicio: {
            [Op.between]: [fecha_inicio, fecha_fin],
         },
      },
      include: [
         {
            model: db.asistencias_vacaciones,
            as: "vacaciones_asistencias",
            include: [
               {
                  model: db.asistencias,
                  as: "asistencias",
               },
            ],
         },
      ],
      order: [
         [
            { model: db.asistencias_vacaciones, as: "vacaciones_asistencias" },
            { model: db.asistencias, as: "asistencias" },
            "fecha",
            "ASC",
         ],
      ],
      transaction,
   });

   //Conteo de vacaciones tomadas y vendidos anteriomenete, solo tomando en cuenta contrtos sin iterupcions
   let contador_dias_vendidos = 0;
   let contador_dias_tomados = 0;
   for (const v of responseVacaciones) {
      const vacacion = v.get({ plain: true });
      for (const a of vacacion.vacaciones_asistencias) {
         if (a.tipo === "gozada") {
            contador_dias_tomados++;
         }
         if (a.tipo === "vendida") {
            contador_dias_vendidos++;
         }
      }
   }
   //Conteo de dias a tomar y vender
   let contador_dias_a_vender = 0;
   let contador_dias_a_gozar = 0;
   const depurar_dias_vacaciones = [];
   for (const v of vacacionesData.vacacionesXasistencias) {
      if (v.tipo === "gozada") {
         contador_dias_a_gozar++;
         depurar_dias_vacaciones.push(v);
      }
      if (v.tipo === "vendida") {
         contador_dias_a_vender++;
         depurar_dias_vacaciones.push(v);
      }
   }

   const payload_validacion = {
      trabajador_id: trabajador.id,
      fecha_inicio: vacacionesData.fecha_inicio,
      fecha_termino: vacacionesData.fecha_termino,
      dias_tomados: contador_dias_a_gozar,
      dias_vendidos: contador_dias_a_vender,
      observaciones: vacacionesData.observaciones,
      dias_usados_tomados: contador_dias_tomados,
      dias_usados_vendidos: contador_dias_vendidos,
      contratos_laborales: contratos_sin_interrupcion || [],
      asignacion_familiar: 126,
      asistenciasXvacaciones: depurar_dias_vacaciones,
      estado: "aprobada",
   };
   const vacaciones = new Vacaciones(payload_validacion);
   const errore = vacaciones.validarCampos();
   if (errore.length > 0) {
      // Lanzamos un error para que el controlador haga rollback
      const err = new Error(errore.join(", "));
      err.statusCode = 400;
      throw err;
   }
   console.log("get de vacaciones: ", vacaciones.get());

   const nuevasVacaciones = await vacacionesRepository.crear(
      vacaciones.get(),
      transaction
   );
   console.log("VACACION CREADA: ", nuevasVacaciones);

   let asistencias_creadas = [];
   const asistencias_ordenadas = vacaciones.getAsistenciasOrdenadas();
   for (const a of asistencias_ordenadas) {
      const payload_asistencia = {
         fecha: a.fecha,
         trabajador_id: trabajador.id,
      };
      if (a.tipo == "gozada") {
         payload_asistencia.estado_asistencia = "vacacion-gozada";
      }
      if (a.tipo == "vendida") {
         payload_asistencia.estado_asistencia = "vacacion-vendida";
      }
      const response = await asistenciaRepository.crearAsistenciaVacaciones(
         payload_asistencia,
         transaction
      );
      asistencias_creadas.push(response);
   }
   console.log("Asistencias creadas: ", asistencias_creadas);

   let vacacionesxasistenciascreadas = [];
   for (const a of asistencias_ordenadas) {
      const payload_a_vacaciones = {
         vacaciones_id: nuevasVacaciones.id,
         tipo: a.tipo,
         fecha: a.fecha,
      };
      const asistencia_v = asistencias_creadas.find(
         (asis) => asis.fecha === a.fecha
      );
      payload_a_vacaciones.asistencia_id = asistencia_v.id;
      const response_v_a =
         await vacacionesRepository.crearVacacionesXasitencias(
            payload_a_vacaciones,
            transaction
         );
      vacacionesxasistenciascreadas.push(response_v_a);
   }
   console.log(
      "Asistencia x vacaciones crearas",
      vacacionesxasistenciascreadas
   );
   return {
      codigo: 201,
      respuesta: {
         mensaje: "¡Vacaciones añadidas exitosamente!.",
         vacaciones: nuevasVacaciones,
      },
   };
};
