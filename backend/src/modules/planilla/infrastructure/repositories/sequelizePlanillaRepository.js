const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos

const SequelizeDataMantenimientoRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");

const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

const moment = require("moment");

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
    console.log("MONTO_ASIGNACION_FAMILIAR", MONTO_ASIGNACION_FAMILIAR);

    const PORCENTAJE_DESCUENTO_ONP = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_onp")).valor
    );

    const PORCENTAJE_DESCUENTO_EPS = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_eps")).valor
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
     ( await dataMantenimientoRepository.obtenerPorCodigo("valor_comision_integra")).valor
    );

    const PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA= Number(
     ( await dataMantenimientoRepository.obtenerPorCodigo("valor_comision_prima")).valor
    );

    const PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO= Number(
     ( await dataMantenimientoRepository.obtenerPorCodigo("valor_comision_profuturo")).valor
    );

    const dataMantenimiento = {
      PORCENTAJE_DESCUENTO_ONP,
      PORCENTAJE_DESCUENTO_EPS,
      PORCENTAJE_DESCUENTO_AFP,
      PORCENTAJE_DESCUENTO_SEGURO,
      PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT,
      PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA,
      PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA,
      PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO,
    };

    const fechaInicioMes = moment(`${fecha_anio_mes}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const fechaFinMes = moment(`${fecha_anio_mes}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    const contratosPlanilla = await db.contratos_laborales.findAll({
      where: {
        filial_id: filial_id,
        estado: true,
        tipo_contrato: "PLANILLA",
        fecha_inicio: { [db.Sequelize.Op.lte]: fechaFinMes },
        fecha_fin: { [db.Sequelize.Op.gte]: fechaInicioMes },
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
         fecha_inicio: { [db.Sequelize.Op.lte]: fechaFinMes },
        fecha_fin: { [db.Sequelize.Op.gte]: fechaInicioMes },
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

    console.log('contratosRxh', contratosRxh);

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
      const sueldoQuincenal = +(sueldoBase / 2).toFixed(2);
      const asignacionFamiliar = trabajador.asignacion_familiar
        ? MONTO_ASIGNACION_FAMILIAR
        : 0;

        console.log('sueldoQuincenal', sueldoQuincenal);
      const sueldoBruto = +(sueldoQuincenal + asignacionFamiliar).toFixed(2);

      if (sistema_pension === "ONP") {
        onp = +(
          (sueldoBruto * dataMantenimiento.PORCENTAJE_DESCUENTO_ONP) /
          100
        ).toFixed(2);
      } else if (sistema_pension === "AFP") {
        console.log({
            sueldoBruto,
            dataMantenimiento: dataMantenimiento.PORCENTAJE_DESCUENTO_AFP
        });
        afp = +(
          (sueldoBruto * dataMantenimiento.PORCENTAJE_DESCUENTO_AFP) /
          100
        ).toFixed(2);
        console.log('afp', afp);
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

      const totalDescuentos = +(onp + afp + seguro).toFixed(2);
      const totalAPagar = +(sueldoBruto - totalDescuentos).toFixed(2);

      listaPlanillaTipoPlanilla.push({
        tipo_documento: trabajador.tipo_documento,
        numero_documento: trabajador.numero_documento,
        nombres: trabajador.nombres,
        apellidos: trabajador.apellidos,
        dias_laborados: 15,
        sueldo_base: sueldoBase,
        sueldo_quincenal: sueldoQuincenal,
        asignacion_familiar: asignacionFamiliar,
        sueldo_bruto: sueldoBruto,
        onp,
        eps,
        afp,
        seguro,
        comision,
        total_descuentos: totalDescuentos,
        total_a_pagar: totalAPagar,
      });
    }

    const listaPlanillaTipoHonorarios = [];

    for (const contrato of contratosRxh) {
        const trabajador = contrato.trabajador;
    
        console.log('trabajador', trabajador)
        const sueldoBase = Number(contrato.sueldo);
        const sueldoQuincenal = +(sueldoBase / 2).toFixed(2);
        const totalAPagar = sueldoQuincenal;
        listaPlanillaTipoHonorarios.push({
        dni: trabajador.numero_documento,
        nombres: `${trabajador.nombres} ${trabajador.apellidos}`,
        dias_laborados: 15,
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
      }
    };
  }
}

module.exports = SequelizePlanillaRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
