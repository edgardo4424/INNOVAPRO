const { Op } = require("sequelize");
const { options } = require("../../interfaces/routes/bonosRoutes");
const { Bonos } = require("../models/bonoModel");
const db = require("../../../../models");

class SequelizeBonoRepository {
   async crearBono(bonoData) {
      const bono = await Bonos.create(bonoData);
      return bono;
   }
   async editarBono(bonoData, transaction = null) {
      const options = {
         where: { id: bonoData.bono_id },
      };
      if (transaction) options.transaction = transaction;

      await Bonos.update(bonoData, options);
   }
   async obtenerBonosPorTrabajadorId(id, transaction = null) {
      const options = { where: { trabajador_id: id, estado: 1 } };
      if (transaction) options.transaction = transaction;
      const bonos = await Bonos.findAll(options);
      return bonos;
   }
   async obtenerBonos(transaction = null) {
      const options = {
         where: { estado: 1 },
         include: [{ model: db.trabajadores, as: "trabajadores" }],
      };
      if (transaction) options.transaction = transaction;
      const bonos = await Bonos.findAll(options);
      return bonos;
   }
   async eliminarBonoPorId(id, transaction = null) {
      const options = {
         where: { id },
      };
      if (transaction) options.transaction = transaction;
      await Bonos.update({ estado: 0 }, options);
   }
   async obtenerBonosDelTrabajadorEnRango(
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

      const bonos = await Bonos.findAll(options);
      return bonos;
   }

   async obtenerBonoTotalDelTrabajadorPorRangoFecha(trabajador_id, fechaInicio, fechaFin){

    const total = await Bonos.sum('monto', {
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

module.exports = SequelizeBonoRepository;
