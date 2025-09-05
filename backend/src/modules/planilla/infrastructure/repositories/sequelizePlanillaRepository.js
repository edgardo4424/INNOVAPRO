const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

const SequelizeDataMantenimientoRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");
const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

const SequelizeQuintaCategoriaRepository = require("../../../quintaCategoria/infrastructure/repositories/SequelizeQuintaCategoriaRepository");
const quintaCategoriaRepository = new SequelizeQuintaCategoriaRepository();

const buildQuintaPublicApi = require("../../../quintaCategoria/application/services/QuintaPublicAPI");
const quintaCategoriaService = buildQuintaPublicApi({
   repo: SequelizeQuintaCategoriaRepository,
});
const moment = require("moment");
const calcularDiasLaborados = require("../../../../services/calcularDiasLaborados");
const calcularDiasLaboradosQuincena = require("../../../../services/calcularDiasLaborados");

const { Op } = db.Sequelize;
const SequelizeTrabajadorRepository = require("../../../trabajadores/infraestructure/repositories/sequelizeTrabajadorRepository");
const {
   trabajador_planilla_model,
} = require("../utils/trabajador_planilla_model");
const filtrarContratosSinInterrupcion = require("../../../../services/filtrarContratosSinInterrupcion");
const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const { trabajador_rxh_model } = require("../utils/trabajador_rxh_model");

const SequelizeGratificacionRepository = require("../../../gratificaciones/infrastructure/repositories/sequelizeGratificacionRepository");
const filtrarGratificacionesSinInterrupcion = require("../../../../services/filtrarGratificacionesSinInterrupcion");
const calcularGratificacionPlanilla = require("../services/cacularGratificacionPlanilla");
const calcularCTSPlanilla = require("../services/calcularCtsPlanilla");
const diasLaborales = require("../utils/dias_laborales");
const SequelizeVacacionesRepository = require("../../../vacaciones/infraestructure/repositories/sequelizeVacacionesRepository");
const InterseccionVacacionesPlanilla = require("../utils/intersecionVacionesPlanilla");
const SequelizeAdelantoSueldoRepository = require("../../../adelanto_sueldo/infraestructure/repositories/sequlizeAdelantoSueldoRepository");
const SequelizeBonoRepository = require("../../../bonos/infraestructure/repositories/sequelizeBonoRepository");

const trabajadorRepository = new SequelizeTrabajadorRepository();
const asistenciasRepository = new SequelizeAsistenciaRepository();
const gratificacionRepository = new SequelizeGratificacionRepository();
const vacacionesRepository = new SequelizeVacacionesRepository();
const adelantoSueldoRepository = new SequelizeAdelantoSueldoRepository();
const bonosRepository = new SequelizeBonoRepository();

const {
   CierrePlanillaQuincenal,
} = require("../models/CierrePlanillaQuincenalModel");
const { PlanillaQuincenal } = require("../models/PlanillaQuincenalModel");
const {
   CierresPlanillaMensual,
} = require("../models/CierrePlanillaMensualModel");
const calcular_periodo_grati_cts = require("../utils/calcular_periodo_grati_cts");

class SequelizePlanillaRepository {
   // prettier-ignore
   async calcularPlanillaQuincenal(
      fecha_anio_mes,
      filial_id,
      transaction = null
   ) {
      const MONTO_ASIGNACION_FAMILIAR = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_asignacion_familiar"
            )
         ).valor
      );

      const PORCENTAJE_DESCUENTO_ONP = Number(
         (await dataMantenimientoRepository.obtenerPorCodigo("valor_onp")).valor
      );

      const PORCENTAJE_DESCUENTO_AFP = Number(
         (await dataMantenimientoRepository.obtenerPorCodigo("valor_afp")).valor
      );

      const PORCENTAJE_DESCUENTO_SEGURO = Number(
         (await dataMantenimientoRepository.obtenerPorCodigo("valor_seguro")).valor
      );

      const PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_comision_afp_habitat"
            )
         ).valor
      );
      const PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_comision_afp_integra"
            )
         ).valor
      );

      const PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_comision_afp_prima"
            )
         ).valor
      );

      const PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_comision_afp_profuturo"
            )
         ).valor
      );

      const dataMantenimiento = {
         PORCENTAJE_DESCUENTO_ONP,
         PORCENTAJE_DESCUENTO_AFP,
         PORCENTAJE_DESCUENTO_SEGURO,
         PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT,
         PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA,
         PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA,
         PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO,
      };

      const fechaInicioMes = moment(`${fecha_anio_mes}-01`).format("YYYY-MM-DD");
      const fechaQuincena = moment(`${fecha_anio_mes}-15`).format("YYYY-MM-DD");

      const contratosPlanilla = await db.contratos_laborales.findAll({
         where: {
            filial_id: filial_id,
            estado: true,
            tipo_contrato: "PLANILLA",
            fecha_inicio: { [Op.lte]: fechaQuincena },
            [Op.or]: [
               { fecha_terminacion_anticipada: null },
               { fecha_terminacion_anticipada: { [Op.gte]: fechaInicioMes } },
            ],
            fecha_fin: { [Op.gte]: fechaInicioMes },
         },
         include: [
            {
               model: db.trabajadores,
               as: "trabajador",
            },
         ],
         raw: false,
         transaction,
      });

      const contratosRxh = await db.contratos_laborales.findAll({
         where: {
            filial_id: filial_id,
            estado: true,
            tipo_contrato: "HONORARIOS",
            fecha_inicio: { [Op.lte]: fechaQuincena },
            [Op.or]: [
               { fecha_terminacion_anticipada: null },
               { fecha_terminacion_anticipada: { [Op.gte]: fechaInicioMes } },
            ],
            fecha_fin: { [Op.gte]: fechaInicioMes },
         },
         include: [
            {
               model: db.trabajadores,
               as: "trabajador",
            },
         ],
         raw: false,
         transaction,
      });

      const anio = fecha_anio_mes.split("-")[0];
      const mes = fecha_anio_mes.split("-")[1];

      const listaPlanillaTipoPlanilla = [];


      for (const contrato of contratosPlanilla) {
         const trabajador = contrato.trabajador;

         const sistema_pension = trabajador.sistema_pension; // 'ONP' o 'AFP'
         const tipo_afp = trabajador.tipo_afp; // 'HABITAT', 'INTEGRA', 'PRIMA', 'PROFUTURO' o null si es ONP

         let onp = 0;
         let afp = 0;
         let seguro = 0;
         let comision = 0;

         const sueldoBase = Number(contrato.sueldo);

         const asignacionFamiliar = trabajador.asignacion_familiar
            ? MONTO_ASIGNACION_FAMILIAR
            : 0;

         const diasLaborados = calcularDiasLaboradosQuincena(
            contrato.fecha_inicio,
            contrato.fecha_fin,
            fecha_anio_mes
         );

         const sueldoQuincenal = +(
            ((sueldoBase / 15) * diasLaborados) /
            2
         ).toFixed(2);

         const sueldoBruto = +(sueldoQuincenal + asignacionFamiliar).toFixed(2);

         if (sistema_pension === "ONP") {
            onp = +(
               (sueldoBruto * dataMantenimiento.PORCENTAJE_DESCUENTO_ONP) /
               100
            ).toFixed(2);
         } else if (sistema_pension === "AFP") {
            afp = +(
               (sueldoBruto * dataMantenimiento.PORCENTAJE_DESCUENTO_AFP) /
               100
            ).toFixed(2);

            seguro = +(
               (sueldoBruto * dataMantenimiento.PORCENTAJE_DESCUENTO_SEGURO) /
               100
            ).toFixed(2);

            if (trabajador.comision_afp) {
               switch (tipo_afp) {
                  case "HABITAT":
                     comision = +(
                        (sueldoBruto * PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT) /
                        100
                     ).toFixed(2);
                     break;
                  case "INTEGRA":
                     comision = +(
                        (sueldoBruto * PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA) /
                        100
                     ).toFixed(2);
                     break;
                  case "PRIMA":
                     comision = +(
                        (sueldoBruto * PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA) /
                        100
                     ).toFixed(2);
                     break;
                  case "PROFUTURO":
                     comision = +(
                        (sueldoBruto * PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO) /
                        100
                     ).toFixed(2);
                     break;
                  default:
                     break;
               }
            }
         }

         /* const quinta_categoria = 0; */
         const { found, retencion_base_mes, registro } =
            await quintaCategoriaService.getRetencionBaseMesPorDni({
               dni: trabajador.numero_documento,
               anio,
               mes,
            });

         const quinta_categoria = found ? +(retencion_base_mes / 2).toFixed(2) : 0;

         const totalDescuentos = +(
            onp +
            afp +
            seguro +
            comision +
            quinta_categoria
         ).toFixed(2);
         const totalAPagar = +(sueldoBruto - totalDescuentos).toFixed(2);

         console.log("contrato.fecha_inicio", contrato.fecha_inicio);

         listaPlanillaTipoPlanilla.push({
            trabajador_id: trabajador.id,

            tipo_documento: trabajador.tipo_documento,
            numero_documento: trabajador.numero_documento,
            nombres: trabajador.nombres,
            apellidos: trabajador.apellidos,
            contrato_id: contrato.id,
            tipo_contrato: contrato.tipo_contrato,
            regimen: contrato.regimen,
            fecha_ingreso: contrato.fecha_inicio,
            fecha_fin: contrato.fecha_fin,
            dias_laborados: diasLaborados,
            sueldo_base: sueldoBase,
            sueldo_quincenal: sueldoQuincenal,
            asignacion_familiar: asignacionFamiliar,
            sueldo_bruto: sueldoBruto,
            onp,
            afp,
            seguro,
            comision,
            quinta_categoria,
            total_descuentos: totalDescuentos,
            total_a_pagar: totalAPagar,

            banco: contrato.banco,
            numero_cuenta: contrato.numero_cuenta
         });
      }

      const listaPlanillaTipoHonorarios = [];

      for (const contrato of contratosRxh) {
         const trabajador = contrato.trabajador;

         const sueldoBase = Number(contrato.sueldo);

         const diasLaborados = calcularDiasLaboradosQuincena(
            contrato.fecha_inicio,
            contrato.fecha_fin,
            fecha_anio_mes
         );

         // (SUELDO/2)/15*DÍAS LABORADOS
         const sueldoQuincenal = +(
            ((sueldoBase / 15) * diasLaborados) /
            2
         ).toFixed(2);

         const totalAPagar = sueldoQuincenal;
         listaPlanillaTipoHonorarios.push({
            trabajador_id: trabajador.id,
            tipo_documento: trabajador.tipo_documento,
            numero_documento: trabajador.numero_documento,
            nombres: trabajador.nombres,
            apellidos: trabajador.apellidos,
            contrato_id: contrato.id,
            tipo_contrato: contrato.tipo_contrato,
            regimen: contrato.regimen,
            fecha_ingreso: contrato.fecha_inicio,
            fecha_fin: contrato.fecha_fin,
            dias_laborados: diasLaborados,
            sueldo_base: sueldoBase,
            sueldo_quincenal: sueldoQuincenal,
            total_a_pagar: totalAPagar,

            banco: contrato.banco,
            numero_cuenta: contrato.numero_cuenta
         });
      }

      return {
         planilla: {
            trabajadores: listaPlanillaTipoPlanilla,
         },
         honorarios: {
            trabajadores: listaPlanillaTipoHonorarios,
         },
         datosCalculo: dataMantenimiento,
      };
   }
   async calcularPlanillaMensualPorTrabajador(
      anio_mes_dia,
      trabajador_id,
      filial_id
   ) {

      const incio_de_mes=`${anio_mes_dia.slice(0, -2)}01`;
      const fin_de_mes=anio_mes_dia;
      const datos_planilla_inicial = { ...trabajador_planilla_model };

      const PORCENTAJE_DESCUENTO_ONP = Number(
         (await dataMantenimientoRepository.obtenerPorCodigo("valor_onp")).valor
      );

      const PORCENTAJE_DESCUENTO_AFP = Number(
         (await dataMantenimientoRepository.obtenerPorCodigo("valor_afp")).valor
      );

      const PORCENTAJE_DESCUENTO_SEGURO = Number(
         (await dataMantenimientoRepository.obtenerPorCodigo("valor_seguro"))
            .valor
      );
      const fecha_cierre_periodo = anio_mes_dia;
      let fecha_inicio_periodo = `${anio_mes_dia.slice(0, -2)}01`;

      const {periodocts,periodograti}=calcular_periodo_grati_cts(anio_mes_dia);

      const dias_mes = anio_mes_dia.slice(-2);
      const response_trabajador = await db.trabajadores.findByPk(
         trabajador_id,
         {
            include: [
               {
                  model: db.contratos_laborales,
                  as: "contratos_laborales",
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
            ],
         }
      );
      const trabajador = response_trabajador.get({ plain: true });

      if (!trabajador) {
         throw new Error("El trabajador no existe.");
      }
      const contratosEnRango = trabajador.contratos_laborales.filter((c) => {
         return (
            c.fecha_fin >= fecha_inicio_periodo && c.fecha_inicio <= fecha_cierre_periodo &&
            c.filial_id == filial_id
         );
      });

      const contrato_actual = contratosEnRango.find((c) => {
         return (
            c.fecha_inicio <= fecha_cierre_periodo &&
            c.fecha_fin >= fecha_cierre_periodo
         );
      });
      if (!contrato_actual) {
         throw new Error("El trabajador no cuenta con un contrato laboral.");
      }

      const contratoInicial = filtrarContratosSinInterrupcion(
         contratosEnRango
      );
   let inicio_contrato = new Date(contratoInicial[0].fecha_inicio);
   let fin_contrato = new Date(contratoInicial[0].fecha_fin);

   let inicio_rango = new Date(fecha_inicio_periodo);
   let fin_rango = new Date(fecha_cierre_periodo);

   // Determinar el rango real cubierto por el contrato dentro del rango general
   let inicio_real = inicio_contrato > inicio_rango ? inicio_contrato : inicio_rango;
   let fin_real = fin_contrato < fin_rango ? fin_contrato : fin_rango;

   // Calcular días contratados (solo si hay solapamiento)
   let dias_contratados = fin_real >= inicio_real
      ? Math.floor((fin_real - inicio_real) / (1000 * 60 * 60 * 24)) + 1
      : 0;

   // Calcular total de días en el rango general
   let total_dias_rango = Math.floor((fin_rango - inicio_rango) / (1000 * 60 * 60 * 24)) + 1;

   // Días no contratados (no laborados)
        let resto_dias_no_contratados = total_dias_rango - dias_contratados;
   if (trabajador.id === 7) {
      console.log('Días no contratados: ', resto_dias_no_contratados);
   }

      const faltas =
         await asistenciasRepository.obtenerCantidadFaltasPorRangoFecha(
            trabajador.id,
            fecha_inicio_periodo,
            fecha_cierre_periodo
         );
      const faltas_justificadas =
         await asistenciasRepository.obtenerCantidadFaltasJustificadas(
            trabajador.id,
            fecha_inicio_periodo,
            fecha_cierre_periodo
         );
      const licencia_con_goce =
         await asistenciasRepository.obtenerCantidadLicenciaConGoce(
            trabajador.id,
            fecha_inicio_periodo,
            fecha_cierre_periodo
         );
      const licencia_sin_goce =
         await asistenciasRepository.obtenerCantidadLicenciaSinGoce(
            trabajador.id,
            fecha_inicio_periodo,
            fecha_cierre_periodo
         );
      const responseV =
         await vacacionesRepository.obtenerVacacionesPorTrabajadorId(
            fecha_inicio_periodo,
            fecha_cierre_periodo,
            trabajador.id
         );
      const vacaciones = responseV.map((v) => v.get({ plain: true }));

      const MONTO_ASIGNACION_FAMILIAR = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_asignacion_familiar"
            )
         ).valor
      );

      let MONTO_GRATIFICACION = await calcularGratificacionPlanilla(
         periodograti,
         filial_id,
         anio_mes_dia.slice(0, -6),
         trabajador.id
      );
      let MONTO_CTS = await calcularCTSPlanilla(
         periodocts,
         anio_mes_dia.slice(0, -6),
         filial_id,
         trabajador.id
      );

      // console.log("Monto Gratificacion: ", MONTO_GRATIFICACION);
      // console.log("Monto CTS: ", MONTO_CTS);
      const responseAsistencias =
         await asistenciasRepository.obtenerAsistenciasPorRangoFecha(
            trabajador.id,
            fecha_inicio_periodo,
            fecha_cierre_periodo
         );
      const asistencias = responseAsistencias.map((a) =>
         a.get({ plain: true })
      );
      let CANTIDAD_HE_PRIMERA_Q = 0;
      let CANTIDAD_HE_SEGUNDA_Q = 0;

      for (const a of asistencias) {
         if (
            a.fecha >= fecha_inicio_periodo &&
            a.fecha <= `${anio_mes_dia.slice(0, -2)}15`
         ) {
            CANTIDAD_HE_PRIMERA_Q += a.horas_extras;
         }
         if (
            a.fecha > `${anio_mes_dia.slice(0, -2)}15` &&
            a.fecha <= fecha_cierre_periodo
         ) {
            CANTIDAD_HE_SEGUNDA_Q += a.horas_extras;
         }
      }
      const FALTAS_PRIMERA_Q =
         await asistenciasRepository.obtenerCantidadFaltasPorRangoFecha(
            trabajador.id,
            fecha_inicio_periodo,
            `${anio_mes_dia.slice(0, -2)}15`
         );
      const FALTAS_SEGUNDA_Q =
         await asistenciasRepository.obtenerCantidadFaltasPorRangoFecha(
            trabajador.id,
            `${anio_mes_dia.slice(0, -2)}16`,
            fecha_cierre_periodo
         );
      const TARDANZA_PRIMERA_Q =
         await asistenciasRepository.obtenerCantidadTardanzasPorRangoFecha(
            trabajador.id,
            fecha_inicio_periodo,
            `${anio_mes_dia.slice(0, -2)}15`
         );
      const TARDANZA_SEGUNDA_Q =
         await asistenciasRepository.obtenerCantidadTardanzasPorRangoFecha(
            trabajador.id,
            `${anio_mes_dia.slice(0, -2)}16`,
            fecha_cierre_periodo
         );
      //Bonos deñ trabajador
      const responseBonos =
         await bonosRepository.obtenerBonosDelTrabajadorEnRango(
            trabajador.id,
            fecha_inicio_periodo,
            fecha_cierre_periodo
         );
      const bonos = responseBonos.map((a) => a.get({ plain: true }));
      let SUMA_BONO_PRIMERA_Q = 0;
      let SUMA_BONO_SEGUNDA_Q = 0;

      for (const b of bonos) {
         if (
            b.fecha >= fecha_inicio_periodo &&
            b.fecha <= `${anio_mes_dia.slice(0, -2)}15`
         ) {
            SUMA_BONO_PRIMERA_Q += Number(b.monto);
         }
         if (
            b.fecha > `${anio_mes_dia.slice(0, -2)}15` &&
            b.fecha <= fecha_cierre_periodo
         ) {
            SUMA_BONO_SEGUNDA_Q += Number(b.monto);
         }
      }
      console.log("Bonos primera Q: ", SUMA_BONO_PRIMERA_Q);
      console.log("Bonos segunda Q: ", SUMA_BONO_SEGUNDA_Q);

      //Renta de quinta

      const { found, retencion_base_mes, registro } =
         await quintaCategoriaService.getRetencionBaseMesPorDni({
            dni: trabajador.numero_documento,
            anio: anio_mes_dia.slice(0, -6),
            mes: anio_mes_dia.slice(5, -3),
         });

      const quinta_categoria = found ? +(retencion_base_mes / 2).toFixed(2) : 0;

      const DIAS_LABORALES = diasLaborales(
         fecha_inicio_periodo,
         fecha_cierre_periodo
      );

      console.log(trabajador.nombres, trabajador.apellidos);
      console.log("Id: ", trabajador.id);

      const DIAS_VACACIONES = InterseccionVacacionesPlanilla(
         vacaciones,
         fecha_inicio_periodo,
         fecha_cierre_periodo
      );
      let MONTO_ADELANTO_SUELDO = 0;
      const responseAdelantos =
         await adelantoSueldoRepository.obtenerAdelantosPorTrabajadorId(
            trabajador_id
         );
      const adelantos = responseAdelantos.map((r) => r.get({ plain: true }));
      for (const a_s of adelantos) {
         MONTO_ADELANTO_SUELDO += a_s.monto / a_s.cuotas;
      }
      console.log("Adelantos: ", MONTO_ADELANTO_SUELDO);

      datos_planilla_inicial.tipo_documento = trabajador.tipo_documento;
      datos_planilla_inicial.numero_documento = trabajador.numero_documento;
      datos_planilla_inicial.nombres_apellidos = `${trabajador.nombres} ${trabajador.apellidos}`;
      datos_planilla_inicial.area = trabajador.cargo.area.nombre;
      datos_planilla_inicial.afp = trabajador.tipo_afp ?? "ONP";
      datos_planilla_inicial.fecha_ingreso = contratoInicial[0].fecha_inicio;
      datos_planilla_inicial.trabajador_id=trabajador.id;
      datos_planilla_inicial.contrato_id=contrato_actual.id
      // dias de labor se resta a los dias del mes, los dias no contradados faltas, vacaciones, (preguntar otros estados?)
      datos_planilla_inicial.dias_labor =
         dias_mes - resto_dias_no_contratados - faltas - DIAS_VACACIONES;
      //sueldo basico es el sueldo base  que se firmo en el contrato
      datos_planilla_inicial.sueldo_basico = contrato_actual.sueldo;
      //sueldo del mes: sueldo que corresponde por dias laborados
      datos_planilla_inicial.sueldo_del_mes = (
         (contrato_actual.sueldo / 30) *
         datos_planilla_inicial.dias_labor
      ).toFixed(2);

      if (trabajador.asignacion_familiar) {
         datos_planilla_inicial.asig_fam = MONTO_ASIGNACION_FAMILIAR;
      }
      datos_planilla_inicial.descanso_medico = (
         (contrato_actual.sueldo / 30) *
         faltas_justificadas
      ).toFixed(2);
      datos_planilla_inicial.licencia_con_goce_de_haber = (
         (contrato_actual.sueldo / 30) *
         licencia_con_goce
      ).toFixed(2);
      datos_planilla_inicial.licencia_sin_goce_de_haber = (
         (contrato_actual.sueldo / 30) *
         licencia_sin_goce
      ).toFixed(2);
      datos_planilla_inicial.vacaciones = (
         (contrato_actual.sueldo / 30) *
         DIAS_VACACIONES
      ).toFixed(2);
      datos_planilla_inicial.gratificacion = MONTO_GRATIFICACION.toFixed(2);
      datos_planilla_inicial.cts = MONTO_CTS.toFixed(2);
      datos_planilla_inicial.h_extras_primera_quincena = (
         CANTIDAD_HE_PRIMERA_Q * 10
      ).toFixed(2);
      datos_planilla_inicial.h_extras_segunda_quincena = (
         CANTIDAD_HE_SEGUNDA_Q * 10
      ).toFixed(2);
      datos_planilla_inicial.faltas_primera_quincena = (
         (contrato_actual.sueldo / DIAS_LABORALES) *
         FALTAS_PRIMERA_Q
      ).toFixed(2);

      datos_planilla_inicial.faltas_segunda_quincena = (
         (contrato_actual.sueldo / DIAS_LABORALES) *
         FALTAS_SEGUNDA_Q
      ).toFixed(2);
      datos_planilla_inicial.tardanza_primera_quincena = (
         TARDANZA_PRIMERA_Q * 15
      ).toFixed(2);
      datos_planilla_inicial.tardanza_segunda_quincena = (
         TARDANZA_SEGUNDA_Q * 15
      ).toFixed(2);
      datos_planilla_inicial.bono_primera_quincena =
         SUMA_BONO_PRIMERA_Q.toFixed(2);
      datos_planilla_inicial.bono_segunda_quincena =
         SUMA_BONO_SEGUNDA_Q.toFixed(2);

      datos_planilla_inicial.quinta_categoria = quinta_categoria;
      datos_planilla_inicial.sueldo_bruto = Number(
         (
            Number(datos_planilla_inicial.sueldo_del_mes) +
            Number(datos_planilla_inicial.asig_fam) +
            Number(datos_planilla_inicial.descanso_medico) +
            Number(datos_planilla_inicial.licencia_con_goce_de_haber) +
            Number(datos_planilla_inicial.licencia_sin_goce_de_haber) * -1 +
            Number(datos_planilla_inicial.vacaciones) +
            Number(datos_planilla_inicial.gratificacion) +
            Number(datos_planilla_inicial.cts) +
            Number(datos_planilla_inicial.h_extras_primera_quincena) +
            Number(datos_planilla_inicial.h_extras_segunda_quincena) +
            Number(datos_planilla_inicial.faltas_primera_quincena) * -1 +
            Number(datos_planilla_inicial.faltas_segunda_quincena) * -1 +
            Number(datos_planilla_inicial.bono_primera_quincena) +
            Number(datos_planilla_inicial.bono_segunda_quincena)
         ).toFixed(2)
      );
      console.log("sueldo bruto: ", datos_planilla_inicial.sueldo_bruto);

      if (trabajador.sistema_pension === "ONP") {
         datos_planilla_inicial.onp = (
            datos_planilla_inicial.sueldo_bruto *
            (PORCENTAJE_DESCUENTO_ONP / 100)
         ).toFixed(2);
      }
      if (trabajador.sistema_pension === "AFP") {
         datos_planilla_inicial.afp_ap_oblig = (
            datos_planilla_inicial.sueldo_bruto *
            (PORCENTAJE_DESCUENTO_AFP / 100)
         ).toFixed(2);
      }
      datos_planilla_inicial.seguro = (
         Number(datos_planilla_inicial.sueldo_bruto) *
         (PORCENTAJE_DESCUENTO_SEGURO / 100)
      ).toFixed(2);

      datos_planilla_inicial.total_descuentos = (
         (Number(datos_planilla_inicial.afp_ap_oblig) +
            Number(datos_planilla_inicial.onp) +
            Number(datos_planilla_inicial.seguro)) /
         2
      ).toFixed(2);

      // falta desde vacaciones hasta cts:,
      datos_planilla_inicial.sueldo_neto = (
         Number(datos_planilla_inicial.sueldo_bruto) -
         Number(datos_planilla_inicial.total_descuentos)
      ).toFixed(2);

      datos_planilla_inicial.sueldo_quincenal = (
         contrato_actual.sueldo / 2 -
         datos_planilla_inicial.total_descuentos
      ).toFixed(2);

      console.log("quincena: ", datos_planilla_inicial.sueldo_quincenal);
      datos_planilla_inicial.adelanto_prestamo =
         MONTO_ADELANTO_SUELDO.toFixed(2);
      datos_planilla_inicial.saldo_por_pagar = (
         datos_planilla_inicial.sueldo_neto -
         datos_planilla_inicial.sueldo_quincenal -
         datos_planilla_inicial.adelanto_prestamo
      ).toFixed(2);
      datos_planilla_inicial.filial_id = contrato_actual.filial_id;
      datos_planilla_inicial.banco = contrato_actual.banco;
      datos_planilla_inicial.numero_cuenta = contrato_actual.numero_cuenta;
      console.log("*******");
      console.log(".............");

      return datos_planilla_inicial;
   }
   async calcularPlanillaMensualPorTrabajadorRXH(anio_mes_dia, trabajador_id) {
      const dataInicialRxH = trabajador_rxh_model;
      const fecha_cierre_periodo = anio_mes_dia;
      let fecha_inicio_periodo = `${anio_mes_dia.slice(0, -2)}01`;
      const dias_mes = anio_mes_dia.slice(-2);
      const response_trabajador = await db.trabajadores.findByPk(
         trabajador_id,
         {
            include: [
               {
                  model: db.contratos_laborales,
                  as: "contratos_laborales",
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
            ],
         }
      );
      const trabajador = response_trabajador.get({ plain: true });
      if (!trabajador) {
         throw new Error("El trabajador no existe.");
      }
      const contrato_actual = trabajador.contratos_laborales.find((c) => {
         return (
            c.fecha_inicio <= fecha_cierre_periodo &&
            c.fecha_fin >= fecha_cierre_periodo
         );
      });
      if (!contrato_actual) {
         throw new Error("El trabajador no cuenta con un contrato laboral.");
      }

      const contratoInicial = filtrarContratosSinInterrupcion(
         trabajador.contratos_laborales
      );
      let resto_dias_no_contratados = 0;
      if (contratoInicial[0].fecha_inicio > fecha_inicio_periodo) {
         resto_dias_no_contratados =
            (new Date(contratoInicial[0].fecha_inicio) -
               new Date(fecha_inicio_periodo)) /
            (1000 * 60 * 60 * 24);
         fecha_inicio_periodo = contratoInicial[0].fecha_inicio;
      }

      const faltas =
         await asistenciasRepository.obtenerCantidadFaltasPorRangoFecha(
            trabajador.id,
            fecha_inicio_periodo,
            fecha_cierre_periodo
         );
      dataInicialRxH.tipo_documento = trabajador.tipo_documento;
      dataInicialRxH.numero_documento = trabajador.numero_documento;
      dataInicialRxH.nombres_apellidos = `${trabajador.nombres} ${trabajador.apellidos}`;
      dataInicialRxH.area = trabajador.cargo.area.nombre;
      dataInicialRxH.fecha_ingreso = contratoInicial[0].fecha_inicio;
      dataInicialRxH.dias_labor = dias_mes - resto_dias_no_contratados - faltas;
      dataInicialRxH.bruto = contrato_actual.sueldo;
      dataInicialRxH.sueldo_del_mes =
         (contrato_actual.sueldo / 30) * dataInicialRxH.dias_labor;
      dataInicialRxH.vacaciones = 0;
      dataInicialRxH.horas_extras = 0;
      dataInicialRxH.falta = (contrato_actual.sueldo / 30) * faltas;
      dataInicialRxH.sueldo_neto =
         Number(dataInicialRxH.sueldo_del_mes) +
         Number(dataInicialRxH.vacaciones) +
         Number(dataInicialRxH.horas_extras) +
         dataInicialRxH.falta * -1;
      return dataInicialRxH;
   }

   async obtenerCierrePlanillaQuincenal(
      fecha_anio_mes,
      filial_id,
      transaction = null
   ) {
      const cierrePlanillaQuincenal = await CierrePlanillaQuincenal.findOne({
         where: { periodo: fecha_anio_mes, filial_id },
         transaction,
      });
      return cierrePlanillaQuincenal;
   }

   async insertarCierrePlanillaQuincenal(data, transaction = null) {
      const options = {};
      if (transaction) {
         options.transaction = transaction;
      }

      const cierrePlanillaQuincenal = await CierrePlanillaQuincenal.create(
         data,
         options
      );
      return cierrePlanillaQuincenal;
   }

   async actualizarCierrePlanillaQuincenal(
      cierre_planilla_quincenal_id,
      data,
      transaction = null
   ) {
      const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
      const cierrePlanillaQuincenal = await CierrePlanillaQuincenal.update(
         data,
         { where: { id: cierre_planilla_quincenal_id } },
         options
      );
      return cierrePlanillaQuincenal;
   }

   async obtenerPlanillaQuincenalCerradas(
      fecha_anio_mes,
      filial_id,
      transaction = null
   ) {
      const cierrePlanillaQuincenal = await CierrePlanillaQuincenal.findOne({
         where: { periodo: fecha_anio_mes, filial_id },
         transaction,
      });
      if (!cierrePlanillaQuincenal) {
         return [];
      }

      const planillaQuincenalCerradas = await PlanillaQuincenal.findAll({
         where: { cierre_planilla_quincenal_id: cierrePlanillaQuincenal.id },
         include: [
            {
               model: db.trabajadores,
               as: "trabajador",
            },
         ],
         transaction,
      });
      return planillaQuincenalCerradas;
   }

   async insertarVariasPlanillaQuincenal(data, transaction = null) {
      const options = {};
      if (transaction) {
         options.transaction = transaction;
      }

      const planillaQuincenal = await PlanillaQuincenal.bulkCreate(
         data,
         options
      );
      return planillaQuincenal;
   }

   async obtenerPlanillaQuincenalPorTrabajador(
      fecha_anio_mes,
      filial_id,
      trabajador_id,
      transaction = null
   ) {
      const planillaQuincenalPorTrabajador = await PlanillaQuincenal.findAll({
         where: { trabajador_id, periodo: fecha_anio_mes, filial_id },
         transaction,
      });

      return planillaQuincenalPorTrabajador;
   }

   async obtenerTotalPlanillaQuincenalPorTrabajador(
      fecha_anio_mes,
      filial_id,
      trabajador_id,
      transaction = null
   ) {
      const planillaQuincenalPorTrabajador = await PlanillaQuincenal.findAll({
         where: { trabajador_id, periodo: fecha_anio_mes, filial_id },
         transaction,
      });

      console.log(
         "planillaQuincenalPorTrabajador",
         planillaQuincenalPorTrabajador
      );

      const total = planillaQuincenalPorTrabajador.reduce(
         (total, gratificacion) => {
            return total + Number(gratificacion.total_pagar);
         },
         0
      );

      return {
         total_pagar: total,
      };
   }

   async obtenerCierrePlanillaMensual(
      fecha_anio_mes,
      filial_id,
   ) {
      console.log('dento funcion',fecha_anio_mes,filial_id);
      
      const cierrePlanillaQuincenal = await CierresPlanillaMensual.findOne({
         where: { periodo: fecha_anio_mes, filial_id }
      });
      return cierrePlanillaQuincenal;
   }
   async generarRegistroCierrePeriodoPlanillaMensual(
      payload,
      transaction = null
   ) {
      const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
      const cierrePlanilla = db.cierres_planilla_mensual.create(payload, options);
      return cierrePlanilla;
   }

   async generarCierreBloqueoPeriodoPlanillaMensual(
      locked_at,
      id,
      transaction = null
   ) {
      const options = {
         where: {
            id: id,
         },
      };
      if (transaction) {
         options.transaction = transaction;
      }
      const cierrePlanilla = db.cierres_planilla_mensual.update(
         { locked_at },
         options
      );
      return cierrePlanilla;
   }

      async crearRegistroPlanilla(datos, transaction = null) {
         const options = {};
         if (transaction) {
            options.transaction = transaction;
         }
         const planilla = db.planilla_mensual.create(datos, transaction);
         return planilla;
      }
}

module.exports = SequelizePlanillaRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
