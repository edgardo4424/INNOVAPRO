const { Op, Sequelize } = require("sequelize");
const db = require("../../../../database/models");
const { AdelantoSueldo } = require("../models/adelantoSueldoModel");
const { isCuotaAplicable } = require("./utils/validarCuotaAplicable");

class SequelizeAdelantoSueldoRepository {
  async crearAdelantoSueldo(adelantoSueldoData) {
    return await AdelantoSueldo.create(adelantoSueldoData);
  }
  async editarAdelantoSueldo(adelantoSueldoData, transaction = null) {
    const options = {
      where: { id: adelantoSueldoData.adelanto_sueldo_id },
    };
    if (transaction) options.transaction = transaction;

    await AdelantoSueldo.update(adelantoSueldoData, options);
  }
  async eliminarAdelantoSueldoPorId(id, transaction = null) {
    const options = {
      where: { id },
    };
    if (transaction) options.transaction = transaction;
    await AdelantoSueldo.update({ estado: 0 }, options);
  }
  async obtenerAdelantosSueldo(transaction = null) {
    const options = {
      where: { estado: 1 },
      include: [{ model: db.trabajadores, as: "trabajadores" }],
    };
    if (transaction) options.transaction = transaction;
    return await AdelantoSueldo.findAll(options);
  }
  async obtenerAdelantosDelTrabajadorEnRango(
    trabajador_id,
    inicio,
    fin,
    transaction = null
  ) {
    const options = {
      where: {
        trabajador_id,
        estado: 1,
        fecha: {
          [Op.between]: [inicio, fin],
        },
      },
      order: [["fecha", "ASC"]],
    };

    if (transaction) {
      options.transaction = transaction;
    }

    return await AdelantoSueldo.findAll(options);
  }
  async obtenerAdelantosPorTrabajadorId(id, transaction = null) {
    const options = {
      where: {
        trabajador_id: id,
        estado: 1,
        cuotas_pagadas: {
          [Op.lt]: Sequelize.col("cuotas"), // cuotas_pagadas < cuotas
        },
      },
    };
    if (transaction) options.transaction = transaction;
    return await AdelantoSueldo.findAll(options);
  }

  async obtenerTotalAdelantosDelTrabajadorPorRangoFecha(
    trabajador_id,
    tipo, // tipo: 'simple' , 'gratificacion' o 'cts'
    fechaInicio,
    fechaFin
  ) {
    const adelantos = await AdelantoSueldo.findAll({
      where: {
        trabajador_id,
        tipo: tipo,
        estado: true, // ajusta si tu campo es 1/0 o 'ACTIVO'
        fecha: { [Op.between]: [fechaInicio, fechaFin] }, // inclusivo
        cuotas_pagadas: { [Op.lt]: Sequelize.col("cuotas") }, // cuotas_pagadas < cuotas
      },
    });

    if (adelantos.length === 0) {
      return {
        totalAdelantosSueldo: 0,
        adelantos_ids: [],
      };
    }

    let totalAdelantos = 0;
    switch (tipo) {
      case "simple":
        totalAdelantos = adelantos.reduce(
          (total, adelanto) =>
            total + Number(adelanto.monto) / Number(adelanto.cuotas),
          0
        );
        break;
      case "gratificacion":
        totalAdelantos = adelantos.reduce(
          (total, adelanto) => total + Number(adelanto.monto),
          0
        );
        break;
      case "cts":
        totalAdelantos = adelantos.reduce(
          (total, adelanto) => total + Number(adelanto.monto),
          0
        );
        break;

      default:
        break;
    }

    return {
      totalAdelantosSueldo: Number(totalAdelantos.toFixed(2)) || 0,
      adelantos_ids: adelantos.map((adelanto) => adelanto.id),
    };
  }

 async obtenerTotalAdelantosDelTrabajadorPorFechaPeriodo(
  trabajador_id,
  tipo, // 'simple' | 'gratificacion' | 'cts'
  fechaInicio,
  fechaFin,
  fecha_anio_mes,
) {
  const adelantos = await AdelantoSueldo.findAll({
    where: {
      trabajador_id,
      tipo,
      estado: true,
      primera_cuota: { [Op.between]: [fechaInicio, fechaFin] },
      cuotas_pagadas: { [Op.lt]: Sequelize.col("cuotas") },
    },
  });

  const adelantosSueldo = [];

  for (const adelanto of adelantos) {
    const aplica = isCuotaAplicable(
      adelanto.primera_cuota,
      adelanto.cuotas,
      fecha_anio_mes,
      adelanto.forma_descuento
    );

   

    if (aplica) {
      adelantosSueldo.push(adelanto);
    }
  }

  if (adelantosSueldo.length === 0) {
    return {
      totalAdelantosSueldo: 0,
      adelantos_ids: [],
    };
  }

  let totalAdelantos = 0;

  switch (tipo) {
    case "simple":
      totalAdelantos = adelantosSueldo.reduce(
        (total, adelanto) =>
          total + Number(adelanto.monto) / Number(adelanto.cuotas),
        0
      );
      break;

    case "gratificacion":
    case "cts":
      totalAdelantos = adelantosSueldo.reduce(
        (total, adelanto) => total + Number(adelanto.monto),
        0
      );
      break;
  }

  return {
    totalAdelantosSueldo: Number(totalAdelantos.toFixed(2)) || 0,
    adelantos_ids: adelantosSueldo.map((a) => a.id),
  };
}
}

module.exports = SequelizeAdelantoSueldoRepository;
