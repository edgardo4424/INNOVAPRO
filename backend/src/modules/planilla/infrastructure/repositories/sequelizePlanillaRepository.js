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

const filtrarContratosSinInterrupcion = require("../../../../services/filtrarContratosSinInterrupcion");
const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");

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
const datosMantPM = require("../services/datosMantenimientoPlanillMensual");
const calcularDiasNoContratado = require("../utils/calcular_dias_no_contratados");
const obtenerDatosAsistencia = require("../services/obtener_datos_asistencia");
const obtenerDatosPorQuincena = require("../services/obtenerDatosPorQuicena");
const unir_planillas_mensuales = require("../utils/unir_planillas_mensuales");

const {
  unificarTrabajadoresTipoPlanillaQuincenal,
} = require("../services/unificarTrabajadoresTipoPlanillaQuincenal");
const {
  unificarTrabajadoresTipoHonorariosQuincenal,
} = require("../services/unificarTrabajadoresTipoHonorariosQuincenal");

const {
  trabajador_planilla_model,
} = require("../utils/trabajador_planilla_model");
const { trabajador_rxh_model } = require("../utils/trabajador_rxh_model");
const { PlanillaMensual } = require("../models/PlanillaMensualModel");
const SequelizeContratoLaboralRepository = require("../../../contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository");
const calcularDiasContratado = require("../utils/calcular_dias_contratado");
const contratoRepository = new SequelizeContratoLaboralRepository();
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
      MONTO_ASIGNACION_FAMILIAR,
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

    const fecha_anio_mes_dia = `${fecha_anio_mes}-15`

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
        // 👇 Si es indefinido => se trae siempre
    // Si no es indefinido => verificar fecha_fin >= fechaInicioMes
        [Op.or]: [
          { es_indefinido: true },
          {
            [Op.and]: [
              { es_indefinido: false },
              { fecha_fin: { [Op.gte]: fechaInicioMes } }
            ]
          }
        ],
      },
      include: [
        {
          model: db.trabajadores,
          as: "trabajador",
          include: [
            {
              model: db.cargos,
              as: "cargo",
            }
          ]
        },
      ],
      raw: false,
      transaction,
    });

    console.log('contratosPlanilla', contratosPlanilla);

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
          include: [
            {
              model: db.cargos,
              as: "cargo",
            }
          ]
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

     /*  const asignacionFamiliar = trabajador.asignacion_familiar
        ? +((MONTO_ASIGNACION_FAMILIAR).toFixed(2))
        : 0; */

       const asignacionFamiliar =
                (trabajador.asignacion_familiar &&
                (new Date(trabajador.asignacion_familiar) >= new Date(contrato.fecha_inicio)))
                  ? dataMantenimiento.MONTO_ASIGNACION_FAMILIAR/2
                  : 0;

      const diasLaborados = calcularDiasLaboradosQuincena(
        contrato.fecha_inicio,
        contrato.fecha_fin,
        fecha_anio_mes
      );

      // (SUELDO/30)*DÍAS LABORADOS
      const sueldoQuincenal = +(
        (sueldoBase / 30) * diasLaborados) 
      .toFixed(2);

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

       const {totalAdelantosSueldo, adelantos_ids} =
                await adelantoSueldoRepository.obtenerTotalAdelantosDelTrabajadorPorRangoFecha(
                  trabajador.id,
                  "simple",
                  /* contrato.fecha_inicio,
                  contrato.fecha_fin, */
                  fecha_anio_mes_dia
                );

      const totalDescuentos = +(
        onp +
        afp +
        seguro +
        comision +
        quinta_categoria +
        totalAdelantosSueldo
      ).toFixed(2);
     
      
      const totalAPagar = +(sueldoBruto - totalDescuentos).toFixed(2);

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
        numero_cuenta: contrato.numero_cuenta,
        tipo_afp: sistema_pension == "AFP" ? tipo_afp : "ONP",

        adelanto_sueldo: totalAdelantosSueldo,
        adelantos_ids: adelantos_ids,

        cargo: trabajador.cargo ? trabajador.cargo.nombre : null,

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

      console.log('diasLaborados', diasLaborados);

      // (SUELDO/30)*DÍAS LABORADOS
      const sueldoQuincenal = +(
        (sueldoBase / 30) * diasLaborados) 
      .toFixed(2);

      
       const {totalAdelantosSueldo, adelantos_ids} =
                await adelantoSueldoRepository.obtenerTotalAdelantosDelTrabajadorPorRangoFecha(
                  trabajador.id,
                  "simple",
                  /* contrato.fecha_inicio,
                  contrato.fecha_fin, */
                  fecha_anio_mes_dia
                );

      const totalAPagar = sueldoQuincenal - totalAdelantosSueldo;
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
        numero_cuenta: contrato.numero_cuenta,

        adelanto_sueldo: totalAdelantosSueldo,
        adelantos_ids: adelantos_ids,

         cargo: trabajador.cargo ? trabajador.cargo.nombre : null,
      });
    }

    const listaPlanillaTipoPlanillaConDetalle = unificarTrabajadoresTipoPlanillaQuincenal(
      listaPlanillaTipoPlanilla)


 const listaPlanillaTipoHonorariosConDetalle = unificarTrabajadoresTipoHonorariosQuincenal(
      listaPlanillaTipoHonorarios)

   //console.dir(listaPlanillaTipoHonorariosConDetalle, { depth: null });


    const data_mat = {
        valor_asignacion_familiar: dataMantenimiento.MONTO_ASIGNACION_FAMILIAR,
        valor_onp: dataMantenimiento.PORCENTAJE_DESCUENTO_ONP,
        valor_afp: dataMantenimiento.PORCENTAJE_DESCUENTO_AFP,
        valor_seguro: dataMantenimiento.PORCENTAJE_DESCUENTO_SEGURO,
        valor_comision_afp_habitat: dataMantenimiento.PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT,
        valor_comision_afp_integra: dataMantenimiento.PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA,
        valor_comision_afp_prima: dataMantenimiento.PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA,
        valor_comision_afp_profuturo: dataMantenimiento.PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO,
       
      }

    return {
      planilla: {
        trabajadores: listaPlanillaTipoPlanillaConDetalle,
      },
      honorarios: {
        trabajadores: listaPlanillaTipoHonorariosConDetalle,
      },
      data_mantenimiento_detalle: data_mat,
    };
  }

  async calcularPlanillaQuincenalTruncaPorTrabajador(
    fecha_anio_mes,
    filial_id,
    trabajador_id,
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
      MONTO_ASIGNACION_FAMILIAR,
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

    const fecha_anio_mes_dia = `${fecha_anio_mes}-15`;

    const contratosPlanilla = await db.contratos_laborales.findAll({
      where: {
        filial_id: filial_id,
        trabajador_id: trabajador_id,
        estado: true,
        tipo_contrato: "PLANILLA",
        fecha_inicio: { [Op.lte]: fechaQuincena },
        [Op.or]: [
          { fecha_terminacion_anticipada: null },
          { fecha_terminacion_anticipada: { [Op.gte]: fechaInicioMes } },
        ],
        //fecha_fin: { [Op.gte]: fechaInicioMes },
        // 👇 Si es indefinido => se trae siempre
        // Si no es indefinido => verificar fecha_fin >= fechaInicioMes
        [Op.or]: [
          { es_indefinido: true },
          {
            [Op.and]: [
              { es_indefinido: false },
              { fecha_fin: { [Op.gte]: fechaInicioMes } },
            ],
          },
        ],
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

      /*  const asignacionFamiliar = trabajador.asignacion_familiar
        ? +((MONTO_ASIGNACION_FAMILIAR).toFixed(2))
        : 0; */

      const asignacionFamiliar =
        trabajador.asignacion_familiar &&
        new Date(trabajador.asignacion_familiar) >=
          new Date(contrato.fecha_inicio)
          ? dataMantenimiento.MONTO_ASIGNACION_FAMILIAR / 2
          : 0;

      const diasLaborados = calcularDiasLaboradosQuincena(
        contrato.fecha_inicio,
        contrato.fecha_fin,
        fecha_anio_mes
      );

      // (SUELDO/30)*DÍAS LABORADOS
      const sueldoQuincenal = +((sueldoBase / 30) * diasLaborados).toFixed(2);

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

      const { totalAdelantosSueldo, adelantos_ids } =
        await adelantoSueldoRepository.obtenerTotalAdelantosDelTrabajadorPorRangoFecha(
          trabajador.id,
          "simple",
          /* contrato.fecha_inicio,
                  contrato.fecha_fin, */
          fecha_anio_mes_dia
        );

      const totalDescuentos = +(
        onp +
        afp +
        seguro +
        comision +
        quinta_categoria +
        totalAdelantosSueldo
      ).toFixed(2);
      if (trabajador.id == 7) {
        console.log("--- Detalle de descuentos para Valeria ---");
        console.log("ONP:", onp);
        console.log("AFP:", afp);
        console.log("Seguro:", seguro);
        console.log("Comisión:", comision);
        console.log("Quinta Categoría:", quinta_categoria);
        console.log("Adelantos de Sueldo:", totalAdelantosSueldo);
        console.log("Total Descuentos:", totalDescuentos);
      }

      const totalAPagar = +(sueldoBruto - totalDescuentos).toFixed(2);

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
        numero_cuenta: contrato.numero_cuenta,
        tipo_afp: sistema_pension == "AFP" ? tipo_afp : "ONP",

        adelanto_sueldo: totalAdelantosSueldo,
        adelantos_ids: adelantos_ids,
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

      // (SUELDO/30)*DÍAS LABORADOS
      const sueldoQuincenal = +((sueldoBase / 30) * diasLaborados).toFixed(2);

      const { totalAdelantosSueldo, adelantos_ids } =
        await adelantoSueldoRepository.obtenerTotalAdelantosDelTrabajadorPorRangoFecha(
          trabajador.id,
          "simple",
          /* contrato.fecha_inicio,
                  contrato.fecha_fin, */
          fecha_anio_mes_dia
        );

      const totalAPagar = sueldoQuincenal - totalAdelantosSueldo;
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
        numero_cuenta: contrato.numero_cuenta,

        adelanto_sueldo: totalAdelantosSueldo,
        adelantos_ids: adelantos_ids,
      });
    }

    const listaPlanillaTipoPlanillaConDetalle =
      unificarTrabajadoresTipoPlanillaQuincenal(listaPlanillaTipoPlanilla);

    console.dir(listaPlanillaTipoPlanillaConDetalle, { depth: null });

    const listaPlanillaTipoHonorariosConDetalle =
      unificarTrabajadoresTipoHonorariosQuincenal(listaPlanillaTipoHonorarios);

    //console.dir(listaPlanillaTipoHonorariosConDetalle, { depth: null });

    const data_mat = {
      valor_asignacion_familiar: dataMantenimiento.MONTO_ASIGNACION_FAMILIAR,
      valor_onp: dataMantenimiento.PORCENTAJE_DESCUENTO_ONP,
      valor_afp: dataMantenimiento.PORCENTAJE_DESCUENTO_AFP,
      valor_seguro: dataMantenimiento.PORCENTAJE_DESCUENTO_SEGURO,
      valor_comision_afp_habitat:
        dataMantenimiento.PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT,
      valor_comision_afp_integra:
        dataMantenimiento.PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA,
      valor_comision_afp_prima:
        dataMantenimiento.PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA,
      valor_comision_afp_profuturo:
        dataMantenimiento.PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO,
    };

    return {
      planilla: {
        trabajadores: listaPlanillaTipoPlanillaConDetalle,
      },
      honorarios: {
        trabajadores: listaPlanillaTipoHonorariosConDetalle,
      },
      data_mantenimiento_detalle: data_mat,
    };
  }

  // prettier-ignore
  async calcularPlanillaMensualPorTrabajadorRXH(anio_mes_dia, trabajador_id,filial_id) {
      const responseQuicenas = await this.obtenerPlanillaQuincenalPorTrabajador(
         `${anio_mes_dia.slice(0, -3)}`,
         filial_id,
         trabajador_id
      );
      const quincenas = responseQuicenas.map((q) => q.get({ plain: true }));
      let MONTO_QUINCENAS = 0;
      if (quincenas.length >=1) {
         for (const q of quincenas) {
            MONTO_QUINCENAS += Number(q.total_pagar);            
         }
      }
      if(trabajador_id==7){
         console.log('Valnetina monto quince rxh',MONTO_QUINCENAS);
      }
      const inicio_de_mes = `${anio_mes_dia.slice(0, -2)}01`;
      const fin_de_mes = anio_mes_dia;     
      const dias_mes = anio_mes_dia.slice(-2);
      const response_trabajador = await db.trabajadores.findByPk(
         trabajador_id,
         {
            include: [
               {
                  model: db.contratos_laborales,
                  as: "contratos_laborales",
                  where: {
                     tipo_contrato: "HONORARIOS",
                     estado:1
                  },
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
      //!Obtenemos el contrato inicial del trbaajdor, no del rango
      const contratoInicial = filtrarContratosSinInterrupcion(
         trabajador.contratos_laborales
      );

      // !Obtenemos los contratos en rango del mes 
      const contratosEnRango = trabajador.contratos_laborales.filter((c) => {
         return (
            c.fecha_fin >= inicio_de_mes &&
            c.fecha_inicio <= fin_de_mes &&
            c.filial_id == filial_id
         );
      });

      const contrato_actual=[...contratosEnRango].sort((a, b) => new Date(a.fecha_fin) - new Date(b.fecha_fin)).at(-1); 

      //!validamos que no halla interrupciones entre contratos
      const contratos_tratados =
         filtrarContratosSinInterrupcion(contratosEnRango);

      let planillasRxhObtenidas=[]
      
      for (const c of contratos_tratados) {

         const data= trabajador_rxh_model();
         let inicio_real =
            c.fecha_inicio > inicio_de_mes ? c.fecha_inicio : inicio_de_mes;
         const fin_contrato=
            c.fecha_terminacion_anticipada?c.fecha_terminacion_anticipada:c.fecha_fin;
         let fin_real = fin_contrato < fin_de_mes ? fin_contrato : fin_de_mes;

         const {
            CANTIDAD_HE_PRIMERA_Q,
            CANTIDAD_HE_SEGUNDA_Q,
            FALTAS_PRIMERA_Q,
            FALTAS_SEGUNDA_Q,
            SUMA_BONO_PRIMERA_Q,
            SUMA_BONO_SEGUNDA_Q,
            TARDANZA_PRIMERA_Q,
            TARDANZA_SEGUNDA_Q,
            CANTIDAD_VACACIONES_GOZADAS,
            CANTIDAD_VACACIONES_VENDIDAS
         } = await obtenerDatosPorQuincena(
            inicio_real,
            fin_real,
            trabajador.id
         );

         const DIAS_NO_CONTRATADOS = calcularDiasNoContratado(
            inicio_real,
            fin_real,
            inicio_de_mes,
            fin_de_mes
         );
         const DIAS_CONTRATADO=calcularDiasContratado(inicio_real,
            fin_contrato,
            inicio_de_mes);
        console.log("dIAS CONTRATADO EN RXH",DIAS_CONTRATADO);
        
         const SUMA_FALTAS=FALTAS_PRIMERA_Q+FALTAS_SEGUNDA_Q;
         data.trabajador_id=trabajador.id;
         data.contrato_id=c.id
         data.tipo_contrato=c.tipo_contrato;
         data.periodo = anio_mes_dia.slice(0, -3);
         data.con
         data.tipo_documento = trabajador.tipo_documento;
         data.numero_documento = trabajador.numero_documento;
         data.nombres_apellidos = `${trabajador.nombres} ${trabajador.apellidos}`;
         data.area = trabajador.cargo.area.nombre;
         data.fecha_ingreso = contratoInicial[0].fecha_inicio;
         data.dias_labor = ((DIAS_CONTRATADO) - SUMA_FALTAS)-CANTIDAD_VACACIONES_GOZADAS;
         data.sueldo_basico = c.sueldo;
         data.sueldo_del_mes =(c.sueldo / 30) * data.dias_labor;
         data.vacaciones = (contrato_actual.sueldo/30)*CANTIDAD_VACACIONES_GOZADAS;
         data.vacaciones_vendidas=(contrato_actual.sueldo/30)*CANTIDAD_VACACIONES_VENDIDAS;
         data.h_extras_primera_quincena=CANTIDAD_HE_PRIMERA_Q;
         data.h_extras_segunda_quincena=CANTIDAD_HE_SEGUNDA_Q;
         data.faltas_primera_quincena=(c.sueldo / 30)*FALTAS_PRIMERA_Q;
         data.faltas_segunda_quincena=(c.sueldo / 30)*FALTAS_SEGUNDA_Q;
         data.tardanza_primera_quincena=(TARDANZA_PRIMERA_Q * 15).toFixed(2);
         data.tardanza_segunda_quincena=(TARDANZA_SEGUNDA_Q*15).toFixed(2);
         data.bono_primera_quincena=SUMA_BONO_PRIMERA_Q;
         data.bono_segunda_quincena=SUMA_BONO_SEGUNDA_Q;
         data.banco=c.banco
         data.numero_cuenta=c.numero_cuenta
         planillasRxhObtenidas.push(data)
      }
      const { totalAdelantosSueldo, adelantos_ids } =
         await adelantoSueldoRepository.obtenerTotalAdelantosDelTrabajadorPorRangoFecha(
            trabajador.id,
            "simple",
            fin_de_mes
         );
      const grupoRxh=trabajador_rxh_model();
      for (const p of planillasRxhObtenidas) {
         grupoRxh.trabajador_id=p.trabajador_id;
         grupoRxh.ruc=trabajador.ruc||"Ruc no disponible";
         grupoRxh.domiciliado=trabajador.domiciliado;
         grupoRxh.tipo_contrato=p.tipo_contrato;
         grupoRxh.contrato_id=p.contrato_id
         grupoRxh.periodo=p.periodo;
         grupoRxh.banco=p.banco
         grupoRxh.numero_cuenta=p.numero_cuenta
         grupoRxh.tipo_documento=p.tipo_documento;
         grupoRxh.numero_documento=p.numero_documento;
         grupoRxh.nombres_apellidos=p.nombres_apellidos;
         grupoRxh.area=p.area;
         grupoRxh.fecha_ingreso=p.fecha_ingreso;
         grupoRxh.dias_labor+=p.dias_labor;
         grupoRxh.sueldo_basico=p.sueldo_basico;
         grupoRxh.sueldo_del_mes+=p.sueldo_del_mes;
         grupoRxh.vacaciones+=p.vacaciones;
         grupoRxh.vacaciones_vendidas+=p.vacaciones_vendidas;
         grupoRxh.h_extras_primera_quincena+=p.h_extras_primera_quincena;
         grupoRxh.h_extras_segunda_quincena+=p.h_extras_segunda_quincena;
         grupoRxh.faltas_primera_quincena+=p.faltas_primera_quincena;
         grupoRxh.faltas_segunda_quincena+=p.faltas_segunda_quincena
         grupoRxh.tardanza_primera_quincena+=Number(p.tardanza_primera_quincena);
         grupoRxh.tardanza_segunda_quincena+=Number(p.tardanza_segunda_quincena);
         grupoRxh.bono_primera_quincena+=p.bono_primera_quincena;
         grupoRxh.bono_segunda_quincena+=p.bono_segunda_quincena;


      }

      grupoRxh.sueldo_neto =
         Number(grupoRxh.sueldo_del_mes) +
         Number(grupoRxh.vacaciones) +
         Number(grupoRxh.h_extras_primera_quincena)+
         Number(grupoRxh.h_extras_segunda_quincena)+
         Number(grupoRxh.tardanza_primera_quincena)*-1+
         Number(grupoRxh.tardanza_segunda_quincena)*-1+
         Number(grupoRxh.faltas_primera_quincena) * -1
         Number(grupoRxh.faltas_segunda_quincena) * -1;
      grupoRxh.sueldo_quincenal=MONTO_QUINCENAS;
      grupoRxh.adelanto_prestamo=totalAdelantosSueldo||0;
      grupoRxh.adelantos_ids=adelantos_ids||[];
      grupoRxh.saldo_por_pagar=(grupoRxh.sueldo_neto-MONTO_QUINCENAS)-grupoRxh.adelanto_prestamo;      
      
      return grupoRxh;
   }
  // prettier-ignore
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
  // prettier-ignore
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
  // prettier-ignore
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
  // prettier-ignore
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
  // prettier-ignore
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
  // prettier-ignore
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
  // prettier-ignore
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
  // prettier-ignore
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
  // prettier-ignore
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
  // prettier-ignore
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
  // prettier-ignore
  async crearRegistroPlanilla(datos, transaction = null) {
         const options = {};
         if (transaction) {
            options.transaction = transaction;
         }
         const planilla = db.planilla_mensual.create(datos, options);
         return planilla;
      }

  async obtenerPlanillaMensualPorTrabajador(
    anio_mes_dia,
    trabajador_id,
    filial_id,
    transaction = null
  ) {
    const responseQuicenas = await this.obtenerPlanillaQuincenalPorTrabajador(
      `${anio_mes_dia.slice(0, -3)}`,
      filial_id,
      trabajador_id,
      transaction
    );
    const quincenas = responseQuicenas.map((q) => q.get({ plain: true }));
    let MONTO_QUINCENAS = 0;
    if (quincenas.length >= 1) {
      for (const q of quincenas) {
        MONTO_QUINCENAS += Number(q.total_pagar);
      }
    }

    const inicio_de_mes = `${anio_mes_dia.slice(0, -2)}01`;
    const fin_de_mes = anio_mes_dia;
    const dias_mes = anio_mes_dia.slice(-2);

    // Todo: datos de mantenimiento de la planilla mensual
    const {
      MONTO_ASIGNACION_FAMILIAR,
      PORCENTAJE_DESCUENTO_AFP,
      PORCENTAJE_DESCUENTO_ONP,
      PORCENTAJE_DESCUENTO_SEGURO,
      PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT,
      PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA,
      PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA,
      PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO,
    } = await datosMantPM();
    //Todo: validamos que el mes que se recibe se le integrara la grati o cts
    const { periodocts, periodograti } = calcular_periodo_grati_cts(fin_de_mes);

    const response_trabajador = await db.trabajadores.findByPk(trabajador_id, {
      include: [
        {
          model: db.contratos_laborales,
          as: "contratos_laborales",
          where: {
            tipo_contrato: "PLANILLA",
            estado:1
          },
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
      transaction,
    });
    if (!response_trabajador) throw new Error("El trabajador no existe.");
    //Se valido que el trabajador exista
    const trabajador = response_trabajador.get({ plain: true });

    const contratoInicial = filtrarContratosSinInterrupcion(
      trabajador.contratos_laborales
    );
    // if (trabajador.id == 1) {
    //   console.log("Lucas contrato incial sin fecha", contratoInicial);
    // }

    //Todo: Obtenemos los contratos que estan en el rango del mes
    const contratosEnRango = trabajador.contratos_laborales.filter(
      (c) =>
        c.filial_id == filial_id &&
        (c.es_indefinido
          ? c.fecha_inicio <= fin_de_mes
          : c.fecha_fin >= inicio_de_mes && c.fecha_inicio <= fin_de_mes)
    );

    if (trabajador.id == 1) {
      console.log(
        "Lucas contratos en rango del mes incial sin fecha",
        contratosEnRango
      );
    }

    // Todo: Se traen solo los contratos que tengan un maxiomo de 1 dia de serparacion
    const contratos_tratados =
      filtrarContratosSinInterrupcion(contratosEnRango);
    if (trabajador.id == 1) {
      console.log(
        "Lucas contratos tratados del mes incial sin fecha",
        contratos_tratados
      );
    }

    const { found, retencion_base_mes, registro } =
      await quintaCategoriaService.getRetencionBaseMesPorDni({
        dni: trabajador.numero_documento,
        anio: anio_mes_dia.slice(0, -6),
        mes: anio_mes_dia.slice(5, -3),
      });
    const QUINTA_CATEGORIA = found ? +retencion_base_mes.toFixed(2) : 0;

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
      trabajador.id,
      transaction
    );
    const DIAS_LABORALES = diasLaborales(
      inicio_de_mes,
      fin_de_mes,
      trabajador.cargo.area.id
    );
    let planillas_obtenidas = [];
    //Todo: Aqui se comenzara a llenar los objetos de la
    for (const c of contratos_tratados) {
      const planilla = trabajador_planilla_model();
      // fecha_inicio fecha_fin
      let inicio_real =
        c.fecha_inicio > inicio_de_mes ? c.fecha_inicio : inicio_de_mes;
      const fin_contrato = c.fecha_terminacion_anticipada
        ? c.fecha_terminacion_anticipada
        : c.fecha_fin;
      let fin_real = fin_contrato < fin_de_mes ? fin_contrato : fin_de_mes;
      const DIAS_NO_CONTRATADOS = calcularDiasNoContratado(
        inicio_real,
        fin_real,
        inicio_de_mes,
        fin_de_mes
      );
      const DIAS_CONTRATADO = calcularDiasContratado(
        inicio_real,
        fin_contrato,
        inicio_de_mes,
        c.es_indefinido
      );
      // console.log("DIAS CONTRTADO:   ",DIAS_CONTRATADO);
      console.log(trabajador.nombres,DIAS_CONTRATADO);
      
      const {
        faltas,
        faltas_justificadas,
        licencia_con_goce,
        licencia_sin_goce,
      } = await obtenerDatosAsistencia(inicio_real, fin_real, trabajador.id);

      const {
        CANTIDAD_HE_PRIMERA_Q,
        CANTIDAD_HE_SEGUNDA_Q,
        FALTAS_PRIMERA_Q,
        FALTAS_SEGUNDA_Q,
        SUMA_BONO_PRIMERA_Q,
        SUMA_BONO_SEGUNDA_Q,
        TARDANZA_PRIMERA_Q,
        TARDANZA_SEGUNDA_Q,
        CANTIDAD_VACACIONES_GOZADAS,
        CANTIDAD_VACACIONES_VENDIDAS,
      } = await obtenerDatosPorQuincena(inicio_real, fin_real, trabajador.id);



      const DIAS_FIJOS = 30;
      planilla.tipo_documento = trabajador.tipo_documento;
      planilla.numero_documento = trabajador.numero_documento;
      planilla.nombres_apellidos = `${trabajador.nombres} ${trabajador.apellidos}`;
      planilla.area = trabajador.cargo.area.nombre;
      planilla.afp = trabajador.tipo_afp ?? "ONP";
      planilla.fecha_ingreso = contratoInicial[0].fecha_inicio;
      planilla.trabajador_id = trabajador.id;
      planilla.contrato_id = c.id;
      planilla.tipo_contrato = c.tipo_contrato;
      planilla.periodo = anio_mes_dia.slice(0, -3);
      planilla.regimen = c.regimen;
      planilla.domiciliado = trabajador.domiciliado;

      // ! dias de labor, se le resta--> dias mo contatados, faltas y dias de vacaciones;
      // prettier-ignore
      planilla.dias_labor=(((DIAS_CONTRATADO) - faltas) - CANTIDAD_VACACIONES_GOZADAS)-licencia_con_goce;
      planilla.sueldo_basico = c.sueldo;
      // sueldo del mes: suedo que corresponde por los dias laborados
      // prettier-ignore
      const DESCUENTO_DIAS=(((DIAS_CONTRATADO)-CANTIDAD_VACACIONES_GOZADAS)-licencia_con_goce)-faltas_justificadas;
      planilla.sueldo_del_mes = ((c.sueldo / 30) * DESCUENTO_DIAS).toFixed(2);
      if (trabajador.asignacion_familiar) {
        planilla.asig_fam = MONTO_ASIGNACION_FAMILIAR;
      }

      // prettier-ignore
      planilla.descanso_medico = ((c.sueldo / 30) *faltas_justificadas).toFixed(2);
      // prettier-ignore
      planilla.licencia_con_goce_de_haber = ((c.sueldo / 30)*licencia_con_goce).toFixed(2);
      // prettier-ignore
      planilla.licencia_sin_goce_de_haber = ((c.sueldo / DIAS_LABORALES) * licencia_sin_goce).toFixed(2);
      planilla.vacaciones = (
        (c.sueldo / 30) *
        CANTIDAD_VACACIONES_GOZADAS
      ).toFixed(2);
      planilla.vacaciones_vendidas = (
        (c.sueldo / 30) *
        CANTIDAD_VACACIONES_VENDIDAS
      ).toFixed(2);

      planilla.gratificacion = MONTO_GRATIFICACION.toFixed(2);
      planilla.cts = MONTO_CTS.toFixed(2);
      // prettier-ignore
      planilla.h_extras_primera_quincena = (CANTIDAD_HE_PRIMERA_Q *(c.sueldo>=2200?12:10)).toFixed(2);

      // prettier-ignore
      planilla.h_extras_segunda_quincena = (CANTIDAD_HE_SEGUNDA_Q *(c.sueldo>=2200?12:10)).toFixed(2);

      // prettier-ignore
      planilla.faltas_primera_quincena = ((c.sueldo / DIAS_LABORALES) * FALTAS_PRIMERA_Q).toFixed(2);

      // prettier-ignore
      planilla.faltas_segunda_quincena = ((c.sueldo / DIAS_LABORALES) * FALTAS_SEGUNDA_Q).toFixed(2);

      const area_id = trabajador.cargo.area.id;
      const determinar_desc_tardanza_area = [6, 2].includes(area_id);
      // prettier-ignore
      if(determinar_desc_tardanza_area){
            planilla.tardanza_primera_quincena = (TARDANZA_PRIMERA_Q * (area_id==6?20:15)).toFixed(2);
            planilla.tardanza_segunda_quincena = (TARDANZA_SEGUNDA_Q * (area_id==6?20:15)).toFixed(2);
         }

      // prettier-ignore
      planilla.bono_primera_quincena = SUMA_BONO_PRIMERA_Q.toFixed(2);

      // prettier-ignore
      planilla.bono_segunda_quincena = SUMA_BONO_SEGUNDA_Q.toFixed(2);

      planilla.sueldo_bruto = Number(
        (
          Number(planilla.sueldo_del_mes) +
          Number(planilla.asig_fam) +
          Number(planilla.descanso_medico) +
          Number(planilla.licencia_con_goce_de_haber) +
          Number(planilla.licencia_sin_goce_de_haber) * -1 +
          Number(planilla.vacaciones) +
          Number(planilla.h_extras_primera_quincena) +
          Number(planilla.h_extras_segunda_quincena) +
          Number(planilla.faltas_primera_quincena) * -1 +
          Number(planilla.faltas_segunda_quincena) * -1 +
          Number(planilla.bono_primera_quincena) +
          Number(planilla.bono_segunda_quincena)
        ).toFixed(2)
      );
      planilla.quinta_categoria = QUINTA_CATEGORIA;
      // console.log('monto quincen a agaurdar: ',MONTO_QUINCENAS);

      planilla.sueldo_quincenal = MONTO_QUINCENAS;
      planilla.filial_id = c.filial_id;
      planilla.banco = c.banco;
      planilla.numero_cuenta = c.numero_cuenta;
      planillas_obtenidas.push(planilla);
    }
    const { totalAdelantosSueldo, adelantos_ids } =
      await adelantoSueldoRepository.obtenerTotalAdelantosDelTrabajadorPorRangoFecha(
        trabajador.id,
        "simple",
        fin_de_mes
      );

    const SUMATORIA_PLANILLA = unir_planillas_mensuales(
      planillas_obtenidas,
      trabajador,
      PORCENTAJE_DESCUENTO_ONP,
      PORCENTAJE_DESCUENTO_AFP,
      PORCENTAJE_DESCUENTO_SEGURO,
      totalAdelantosSueldo,
      adelantos_ids,
      PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT,
      PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA,
      PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA,
      PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO
    );

    return SUMATORIA_PLANILLA;
  }
  async obtenerPlanillaMensualCerradas(
    fecha_anio_mes,
    filial_id,
    transaction = null
  ) {
    const cierrePlanillaMensual = await CierresPlanillaMensual.findOne({
      where: { periodo: fecha_anio_mes, filial_id },
      transaction,
    });
    if (!cierrePlanillaMensual) {
      return [];
    }

    const planillaMensualCerradas = await PlanillaMensual.findAll({
      where: { cierre_planilla_mensual_id: cierrePlanillaMensual.id },
      include: [
        {
          model: db.planilla_mensual_recibo_honorario,
          as: "recibo",
          include: [
            {
              model: db.recibos_por_honorarios,
              as: "recibo_por_honorario",
            },
          ],
        },
      ],
      transaction,
    });
    return planillaMensualCerradas;
  }
  async obtenerReciboPorPlanilla(
    fecha_anio_mes,
    filial_id,
    transaction = null
  ) {
    const cierrePlanillaMensual = await CierresPlanillaMensual.findOne({
      where: { periodo: fecha_anio_mes, filial_id },
      transaction,
    });
    if (!cierrePlanillaMensual) {
      return [];
    }

    const planillaMensualCerradas = await PlanillaMensual.findAll({
      where: {
        cierre_planilla_mensual_id: cierrePlanillaMensual.id,
        tipo_contrato: "HONORARIOS",
      },
      attributes: [
        "id",
        "trabajador_id",
        "tipo_contrato",
        "regimen",
        "periodo",
        "tipo_documento",
        "numero_documento",
        "area",
        "nombres_apellidos",
      ],
      include: [
        {
          model: db.planilla_mensual_recibo_honorario,
          as: "recibo",
          include: [
            {
              model: db.recibos_por_honorarios,
              as: "recibo_por_honorario",
            },
          ],
        },
      ],
      transaction,
    });
    for (const planilla of planillaMensualCerradas) {
      const recibo = planilla.recibo;
      const reciboHonorario = recibo?.recibo_por_honorario;

      if (
        reciboHonorario &&
        reciboHonorario.indicador_retencion_cuarta_categoria !== undefined
      ) {
        reciboHonorario.indicador_retencion_cuarta_categoria =
          reciboHonorario.indicador_retencion_cuarta_categoria == 1;
      }
    }

    return planillaMensualCerradas;
  }
}

module.exports = SequelizePlanillaRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
