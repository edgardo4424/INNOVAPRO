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
      fechaInicio,
      fechaFin
   ) {
      const total = await AdelantoSueldo.sum("monto", {
         where: {
            trabajador_id,
            estado: true, // ajusta si tu campo es 1/0 o 'ACTIVO'
            fecha: { [Op.between]: [fechaInicio, fechaFin] }, // inclusivo
            // deleted_at: null, // si usas soft delete y paranoid:false
         },
         // logging: console.log, // útil para depurar el SQL
      });

      return Number(total || 0);
   }
}

module.exports = SequelizeAdelantoSueldoRepository;
