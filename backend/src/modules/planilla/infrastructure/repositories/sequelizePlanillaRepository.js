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
const trabajadorRepository = new SequelizeTrabajadorRepository();
const asistenciasRepository = new SequelizeAsistenciaRepository();

class SequelizePlanillaRepository {
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
         (await dataMantenimientoRepository.obtenerPorCodigo("valor_seguro"))
            .valor
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

      const fechaInicioMes = moment(`${fecha_anio_mes}-01`).format(
         "YYYY-MM-DD"
      );
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

      console.log("contratosPlanilla", contratosPlanilla);

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
                     (sueldoBruto *
                        PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO) /
                     100
                  ).toFixed(2);
                  break;
               default:
                  break;
            }
         }

         /* const quinta_categoria = 0; */
         const { found, retencion_base_mes, registro } =
            await quintaCategoriaService.getRetencionBaseMesPorDni({
               dni: trabajador.numero_documento,
               anio,
               mes,
            });

         const quinta_categoria = found
            ? +(retencion_base_mes / 2).toFixed(2)
            : 0;

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
            tipo_documento: trabajador.tipo_documento,
            numero_documento: trabajador.numero_documento,
            nombres: trabajador.nombres,
            apellidos: trabajador.apellidos,
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
            tipo_documento: trabajador.tipo_documento,
            numero_documento: trabajador.numero_documento,
            nombres: trabajador.nombres,
            apellidos: trabajador.apellidos,
            dias_laborados: diasLaborados,
            sueldo_base: sueldoBase,
            sueldo_quincenal: sueldoQuincenal,
            total_a_pagar: totalAPagar,
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
      trabajador_id
   ) {
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
      const dias_mes = anio_mes_dia.slice(-2);
      const datos_planilla_inicial = { ...trabajador_planilla_model };
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


      const MONTO_ASIGNACION_FAMILIAR = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_asignacion_familiar"
            )
         ).valor
      );

      datos_planilla_inicial.tipo_documento = trabajador.tipo_documento;
      datos_planilla_inicial.numero_documento = trabajador.numero_documento;
      datos_planilla_inicial.nombres_apellidos = `${trabajador.nombres} ${trabajador.apellidos}`;
      datos_planilla_inicial.area = trabajador.cargo.area.nombre;
      datos_planilla_inicial.afp = trabajador.tipo_afp;
      datos_planilla_inicial.fecha_ingreso = contratoInicial[0].fecha_inicio;
      datos_planilla_inicial.dias_labor =
         dias_mes - resto_dias_no_contratados - faltas;
      datos_planilla_inicial.sueldo_basico = contrato_actual.sueldo;
      datos_planilla_inicial.sueldo_del_mes =
         (contrato_actual.sueldo / 30) * datos_planilla_inicial.dias_labor;
      if (trabajador.asignacion_familiar) {
         datos_planilla_inicial.asig_fam = MONTO_ASIGNACION_FAMILIAR;
      }
      datos_planilla_inicial.descanso_medico =
         (contrato_actual.sueldo / 30) * faltas_justificadas;
      datos_planilla_inicial.licencia_con_goce_de_haber =
         (contrato_actual.sueldo / 30) * licencia_con_goce;
      datos_planilla_inicial.licencia_sin_goce_de_haber =
         (contrato_actual.sueldo / 30) * licencia_sin_goce;

      datos_planilla_inicial.sueldo_bruto =
         datos_planilla_inicial.sueldo_del_mes +
         datos_planilla_inicial.asig_fam +
         datos_planilla_inicial.descanso_medico +
         datos_planilla_inicial.licencia_con_goce_de_haber +
         datos_planilla_inicial.licencia_sin_goce_de_haber * -1 +
         datos_planilla_inicial.vacaciones +
         datos_planilla_inicial.gratificacion +
         datos_planilla_inicial.cts +
         datos_planilla_inicial.h_extras_primera_quincena +
         datos_planilla_inicial.h_extras_segunda_quincena +
         datos_planilla_inicial.salida_obra_1era_quincena +
         datos_planilla_inicial.salida_obra_2da_quincena +
         datos_planilla_inicial.faltas_primera_quincena * -1 +
         datos_planilla_inicial.faltas_segunda_quincena * -1 +
         datos_planilla_inicial.bono_por_montaje_primera_quincena +
         datos_planilla_inicial.bono_por_montaje_segunda_quincena;
      if (trabajador.sistema_pension === "ONP") {
         datos_planilla_inicial.onp = PORCENTAJE_DESCUENTO_ONP;
      }
      if (trabajador.sistema_pension === "AFP") {
         datos_planilla_inicial.afp_ap_oblig =
            datos_planilla_inicial.sueldo_bruto *
            (PORCENTAJE_DESCUENTO_AFP / 100);
      }
      datos_planilla_inicial.seguro =
         datos_planilla_inicial.sueldo_bruto *
         (PORCENTAJE_DESCUENTO_SEGURO / 100);


      // falta desde vacaciones hasta cts:,

      return datos_planilla_inicial;
   }
   async calcularPlanillaMensualPorTrabajadorRXH(
      anio_mes_dia,
      trabajador_id
   ) {
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
      return dataInicialRxH
   }
}

module.exports = SequelizePlanillaRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
