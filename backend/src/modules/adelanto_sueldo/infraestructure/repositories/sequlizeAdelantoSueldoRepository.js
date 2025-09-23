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
  async aumnetarCuotaPagada(adelanto_id, transaction = null) {
    const options = {
      where: { id:adelanto_id },
    };
    if (transaction) options.transaction = transaction;
    await AdelantoSueldo.update({cuotas_pagadas:Sequelize.literal('cuotas_pagadas + 1')}, options);
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
   /*  fechaInicio,
    fechaFin, */
    fecha_anio_mes_dia,// 2025-09-31
    transaction = null
  ) {


   let optionsWhere = {
      trabajador_id,
        tipo: tipo,
        estado: true, // ajusta si tu campo es 1/0 o 'ACTIVO'
        cuotas_pagadas: { [Op.lt]: Sequelize.col("cuotas") }, // cuotas_pagadas < cuotas
   }
   /* if(fecha_anio_mes_dia){
     optionsWhere.primera_cuota = { [Op.between]: [fechaInicio, fechaFin] }
   } */
    const adelantos = await AdelantoSueldo.findAll({
      where: optionsWhere,
    }, transaction);

    let adelantosQueAplican = [];

    if (adelantos.length === 0) {
      return {
        totalAdelantosSueldo: 0,
        adelantos_ids: [],
      };
    }

    if (tipo == "simple") {
      for (const adelanto of adelantos) {
        const aplica = isCuotaAplicable(
          adelanto.primera_cuota,
          adelanto.cuotas,
          fecha_anio_mes_dia,
          adelanto.forma_descuento
        );

        if (aplica) {
          adelantosQueAplican.push(adelanto);
        }
      }
    }else{
      adelantosQueAplican = adelantos
    }

    let totalAdelantos = 0;
    switch (tipo) {
      case "simple":
        totalAdelantos = adelantosQueAplican.reduce(
          (total, adelanto) =>
            total + Number(adelanto.monto) / Number(adelanto.cuotas),
          0
        );
        break;
      case "gratificacion":
        totalAdelantos = adelantosQueAplican.reduce(
          (total, adelanto) => total + Number(adelanto.monto),
          0
        );
        break;
      case "cts":
        totalAdelantos = adelantosQueAplican.reduce(
          (total, adelanto) => total + Number(adelanto.monto),
          0
        );
        break;

      default:
        break;
    }

    const adelantos_ids = adelantosQueAplican.map((adelanto) => adelanto.id);

    return {
      totalAdelantosSueldo: Number(totalAdelantos.toFixed(2)) || 0,
      adelantos_ids: adelantos_ids,
    };
  }
  
}

module.exports = SequelizeAdelantoSueldoRepository;
