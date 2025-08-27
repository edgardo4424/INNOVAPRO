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

    const dataMantenimiento = {
      PORCENTAJE_DESCUENTO_ONP,
      PORCENTAJE_DESCUENTO_EPS,
      PORCENTAJE_DESCUENTO_AFP,
      PORCENTAJE_DESCUENTO_SEGURO,
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

    const listaPlanillaTipoPlanilla = [];
    
    for (const contrato of contratosPlanilla) {
      const trabajador = contrato.trabajador;

      const sistema_pension = trabajador.sistema_pension; // 'ONP' o 'AFP'

      let onp = 0;
      let afp = 0;
      let seguro = 0;

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
      }

      const eps =
        trabajador?.sistema_salud === "EPS"   // EPS o ESSALUD
          ? +(
              (sueldoBruto * dataMantenimiento.PORCENTAJE_DESCUENTO_EPS) /
              100
            ).toFixed(2)
          : 0;

      const totalDescuentos = +(onp + eps + afp + seguro).toFixed(2);
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
