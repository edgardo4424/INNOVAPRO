const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

const SequelizeDataMantenimientoRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");
const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

const SequelizeQuintaCategoriaRepository = require("../../../quintaCategoria/infrastructure/repositories/SequelizeQuintaCategoriaRepository");
const quintaCategoriaRepository = new SequelizeQuintaCategoriaRepository();

const buildQuintaPublicApi = require('../../../quintaCategoria/application/services/QuintaPublicAPI');
const quintaCategoriaService =  buildQuintaPublicApi({repo: SequelizeQuintaCategoriaRepository});

const moment = require("moment");
const calcularDiasLaborados = require("../../../../services/calcularDiasLaborados");
const calcularDiasLaboradosQuincena = require("../../../../services/calcularDiasLaborados");

const { Op } = db.Sequelize;

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
     ( await dataMantenimientoRepository.obtenerPorCodigo("valor_seguro")).valor
    );

     const PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT = Number(
     ( await dataMantenimientoRepository.obtenerPorCodigo("valor_comision_afp_habitat")).valor
    );
     const PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA= Number(
     ( await dataMantenimientoRepository.obtenerPorCodigo("valor_comision_afp_integra")).valor
    );

    const PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA= Number(
     ( await dataMantenimientoRepository.obtenerPorCodigo("valor_comision_afp_prima")).valor
    );

    const PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO= Number(
     ( await dataMantenimientoRepository.obtenerPorCodigo("valor_comision_afp_profuturo")).valor
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
      { fecha_terminacion_anticipada: { [Op.gte]: fechaInicioMes } }
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
      { fecha_terminacion_anticipada: { [Op.gte]: fechaInicioMes } }
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

    console.log('contratosPlanilla',contratosPlanilla);
    
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

        
      const diasLaborados = calcularDiasLaboradosQuincena(contrato.fecha_inicio, contrato.fecha_fin, fecha_anio_mes);

      
      const sueldoQuincenal = +(((sueldoBase / 15) * diasLaborados)/2).toFixed(2);

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
                  (sueldoBruto * PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO) /
                  100
                ).toFixed(2);
                break;
            default:
                break;
        }
      }

        /* const quinta_categoria = 0; */
      const {found, retencion_base_mes, registro} = (await quintaCategoriaService.getRetencionBaseMesPorDni(
        {
            dni: trabajador.numero_documento, 
            anio, 
            mes
        }
      ));

      const quinta_categoria = found ? +(((retencion_base_mes)/2).toFixed(2)) : 0;

      const totalDescuentos = +(onp + afp + seguro + comision + quinta_categoria).toFixed(2);
      const totalAPagar = +(sueldoBruto - totalDescuentos).toFixed(2);

      console.log('contrato.fecha_inicio', contrato.fecha_inicio);


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

          const diasLaborados = calcularDiasLaboradosQuincena(contrato.fecha_inicio, contrato.fecha_fin, fecha_anio_mes);

      // (SUELDO/2)/15*DÍAS LABORADOS
        const sueldoQuincenal = +(((sueldoBase / 15) * diasLaborados)/2).toFixed(2);

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
      datosCalculo: dataMantenimiento
    };
  }
}

module.exports = SequelizePlanillaRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
