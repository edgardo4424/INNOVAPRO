const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos // Llamamos los modelos sequalize de la base de datos


const SequelizeDataMantenimientoRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");

const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

const { CierreGratificacion } = require("../models/CierreGratificacionModel");
const { Gratificacion } = require("../models/GratificacionModel");
const { calcularComponentesGratificaciones } = require("../services/calcularComponentesGratificacion");

class SequelizeGratificacionRepository {
  async obtenerGratificacionesCerradas(
    periodo,
    anio,
    filial_id,
    transaction = null
  ) {
    let periodoBuscar;
    switch (periodo) {
      case "JULIO":
        periodoBuscar = `${anio}-07`;
        break;
      case "DICIEMBRE":
        periodoBuscar = `${anio}-12`;
        break;

      default:
        break;
    }

    const cierreGratificacion = await CierreGratificacion.findOne({
      where: { periodo: periodoBuscar, filial_id },
      transaction,
    });
    if (!cierreGratificacion) {
        return [];
    }

    const gratificacionesCerradas = await Gratificacion.findAll({
      where: { cierre_id: cierreGratificacion.id },
      include: [
        {
          model: db.trabajadores,
          as: "trabajador",
        }
      ],
      transaction,
    });

    console.log('gratificacionesCerradas', gratificacionesCerradas);
    return gratificacionesCerradas;
  }

  async calcularGratificaciones(periodo, anio, filial_id, transaction = null) {
    const MONTO_ASIGNACION_FAMILIAR = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_asignacion_familiar"
        )
      ).valor
    );
    console.log("MONTO_ASIGNACION_FAMILIAR", MONTO_ASIGNACION_FAMILIAR);

    const MONTO_FALTA_POR_DIA = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_falta")).valor
    );
    console.log("MONTO_FALTA_POR_DIA", MONTO_FALTA_POR_DIA);

    const MONTO_POR_HORA_EXTRA = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_hora_extra"))
        .valor
    );
    console.log("MONTO_POR_HORA_EXTRA", MONTO_POR_HORA_EXTRA);

    const MONTO_NO_COMPUTABLE = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_no_computable"
        )
      ).valor
    );
    console.log("MONTO_NO_COMPUTABLE", MONTO_NO_COMPUTABLE);

    const PORCENTAJE_BONIFICACION_ESSALUD = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_bonificacion_essalud"
        )
      ).valor
    );
    console.log(
      "PORCENTAJE_BONIFICACION_ESSALUD",
      PORCENTAJE_BONIFICACION_ESSALUD
    );

    const PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_desc_quinta_categoria_no_domiciliado"
        )
      ).valor
    );

    console.log(
      "PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO",
      PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO
    );

    const dataMantenimiento = {
      MONTO_ASIGNACION_FAMILIAR,
      MONTO_FALTA_POR_DIA,
      MONTO_POR_HORA_EXTRA,
      MONTO_NO_COMPUTABLE,
      PORCENTAJE_BONIFICACION_ESSALUD,
      PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO,
    }

    const contratos = await db.contratos_laborales.findAll({
      where: {
        filial_id: filial_id,
        estado: true,
        tipo_contrato: "PLANILLA",
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

    console.log('contratos', contratos[contratos.length - 1]);

    return await calcularComponentesGratificaciones(
      contratos,
      periodo,
      anio,
      dataMantenimiento
    )
  }

  async insertarCierreGratificacion(data, transaction = null) {
    const options = {};
    if (transaction) {
      options.transaction = transaction;
    }

    const cierreGratificacion = await CierreGratificacion.create(data, options);
    return cierreGratificacion;
  }

  async insertarVariasGratificaciones(data, transaction = null) {
    const options = {};
    if (transaction) {
      options.transaction = transaction;
    }

    const gratificaciones = await Gratificacion.bulkCreate(data, options);
    return gratificaciones;
  }

  async insertarUnaGratificacion(data, transaction = null) {
    const options = {};
    if (transaction) {
      options.transaction = transaction;
    }

    const gratificacion = await Gratificacion.create(data, options);
    return gratificacion;
  }

  async obtenerCierreGratificacion(
    periodo,
    anio,
    filial_id,
    transaction = null
  ) {
    let periodoBuscar;
    switch (periodo) {
      case "JULIO":
        periodoBuscar = `${anio}-07`;
        break;
      case "DICIEMBRE":
        periodoBuscar = `${anio}-12`;
        break;

      default:
        break;
    }
    const cierreGratificacion = await CierreGratificacion.findOne({
      where: { periodo: periodoBuscar, filial_id },
      transaction,
    });
    return cierreGratificacion;
  }

  async obtenerGratificacionPorTrabajador(
    periodo,
    anio,
    filial_id,
    trabajador_id,
    transaction = null
  ) {
    let periodoBuscar;
    switch (periodo) {
      case "JULIO":
        periodoBuscar = `${anio}-07`;
        break;
      case "DICIEMBRE":
        periodoBuscar = `${anio}-12`;
        break;

      default:
        break;
    }
    const gratificacionPorTrabajador = await Gratificacion.findAll({
      where: { trabajador_id, periodo: periodoBuscar, filial_id },
      transaction,
    });

    return gratificacionPorTrabajador;
  }

  async actualizarCierreGratificacion(cierre_id, data, transaction = null) {
    const options = {};
    if (transaction) {
      options.transaction = transaction;
    }
    const cierreGratificacion = await CierreGratificacion.update(
      data,
      { where: { id: cierre_id } },
      options
    );
    return cierreGratificacion;
  }

  async calcularGratificacionTruncaPorTrabajador(periodo, anio, filial_id, trabajador_id, transaction = null) {
    
    console.log('ENTRE PE CHAMO');

    const MONTO_ASIGNACION_FAMILIAR = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_asignacion_familiar"
        )
      ).valor
    );
    console.log("MONTO_ASIGNACION_FAMILIAR", MONTO_ASIGNACION_FAMILIAR);

    const MONTO_FALTA_POR_DIA = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_falta")).valor
    );
    console.log("MONTO_FALTA_POR_DIA", MONTO_FALTA_POR_DIA);

    const MONTO_POR_HORA_EXTRA = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_hora_extra"))
        .valor
    );
    console.log("MONTO_POR_HORA_EXTRA", MONTO_POR_HORA_EXTRA);

    const MONTO_NO_COMPUTABLE = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_no_computable"
        )
      ).valor
    );
    console.log("MONTO_NO_COMPUTABLE", MONTO_NO_COMPUTABLE);

    const PORCENTAJE_BONIFICACION_ESSALUD = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_bonificacion_essalud"
        )
      ).valor
    );
    console.log(
      "PORCENTAJE_BONIFICACION_ESSALUD",
      PORCENTAJE_BONIFICACION_ESSALUD
    );

    const PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_desc_quinta_categoria_no_domiciliado"
        )
      ).valor
    );

    console.log(
      "PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO",
      PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO
    );

    const dataMantenimiento = {
      MONTO_ASIGNACION_FAMILIAR,
      MONTO_FALTA_POR_DIA,
      MONTO_POR_HORA_EXTRA,
      MONTO_NO_COMPUTABLE,
      PORCENTAJE_BONIFICACION_ESSALUD,
      PORCENTAJE_DESCUENTO_5TA_CATEGORIA_NO_DOMICILIADO,
    }

    const contratos = await db.contratos_laborales.findAll({
      where: {
        filial_id: filial_id,
        trabajador_id: trabajador_id,
        estado: true,
        tipo_contrato: "PLANILLA",
        
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


    return await calcularComponentesGratificaciones(
      contratos,
      periodo,
      anio,
      dataMantenimiento,
    )
  }

  async obtenerGratificacionPorTrabajadorYRangoFecha(
    periodo,
    anio,
    filial_id,
    trabajador_id,
    fecha_ingreso,
    fecha_fin,
    transaction = null
  ) {
    let periodoBuscar;
    switch (periodo) {
      case "JULIO":
        periodoBuscar = `${anio}-07`;
        break;
      case "DICIEMBRE":
        periodoBuscar = `${anio}-12`;
        break;

      default:
        break;
    }
    const gratificacionPorTrabajador = await Gratificacion.findOne({
      where: { trabajador_id, periodo: periodoBuscar, filial_id, fecha_ingreso, fecha_fin },
      transaction,
    });

    return gratificacionPorTrabajador;
  }
  
  async obtenerTotalGratificacionPorTrabajador(
    periodo,
    anio,
    filial_id,
    trabajador_id,
    transaction = null
  ) {
    let periodoBuscar;
    switch (periodo) {
      case "JULIO":
        periodoBuscar = `${anio}-07`;
        break;
      case "DICIEMBRE":
        periodoBuscar = `${anio}-12`;
        break;

      default:
        break;
    }

    console.log({
      trabajador_id,
      periodo: periodoBuscar,
      filial_id
    });
    const gratificacionPorTrabajador = await Gratificacion.findAll({
      where: { trabajador_id, periodo: periodoBuscar, filial_id },
      transaction,
    });

    console.log('gratificacionPorTrabajador', gratificacionPorTrabajador);

    const total = gratificacionPorTrabajador.reduce((total, gratificacion) => {
      return total + Number(gratificacion.total_pagar);
    }, 0);

    return {
      total_pagar: total
    };
  }
}

module.exports = SequelizeGratificacionRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
