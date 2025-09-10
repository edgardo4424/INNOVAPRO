const { Op, Sequelize } = require("sequelize");
const db = require("../../../../database/models");
const { AdelantoSueldo } = require("../models/adelantoSueldoModel");

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

      let totalAdelantos = 0;
      switch (tipo) {
         case "simple":
            totalAdelantos = adelantos.reduce((total, adelanto) => total + (Number(adelanto.monto)/Number(adelanto.cuotas)), 0);            
            break;
         case "gratificacion":
            totalAdelantos = adelantos.reduce((total, adelanto) => total + Number(adelanto.monto), 0);
            break;
         case "cts":
            totalAdelantos = adelantos.reduce((total, adelanto) => total + Number(adelanto.monto), 0);
            break;
      
         default:
            break;
      }
      
      return Number(totalAdelantos.toFixed(2));
   }
}

module.exports = SequelizeAdelantoSueldoRepository;
