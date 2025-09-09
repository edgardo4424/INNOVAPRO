const { ContratoLaboral } = require("../models/contratoLaboralModel");
const { Op } = require("sequelize");
const { Trabajador } = require("../../../trabajadores/infraestructure/models/trabajadorModel");

// Helper
function periodoMes(anio, mes) {
  const A = Number(anio), M = Number(mes);
  if (!Number.isInteger(A) || !Number.isInteger(M) || M < 1 || M > 12) {
    throw new Error(`periodoMes inválido: anio=${anio}, mes=${mes}`);
  }
  const pad2 = (n) => String(n).padStart(2, '0');
  const ymd  = (d) => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  const desdeDate = new Date(A, M - 1, 1); // primer día del mes
  const hastaDate = new Date(A, M, 0);     // último día real (28/29/30/31)
  return { desde: ymd(desdeDate), hasta: ymd(hastaDate) };
}

class SequelizeContratoLaboralRepository {
   async crear(contratoLaboralData, transaction = null) {
      const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
      const contratoLaboral = await ContratoLaboral.create(
         contratoLaboralData,
         options
      );
      return contratoLaboral;
   }
   async editarContratoLaboral(contratoLaboralData, transaction = null) {
      const options = { where: { id: contratoLaboralData.contrato_id } };
      if (transaction) {
         options.transaction = transaction;
      }
      console.log(contratoLaboralData);

      const contratoLaboral = await ContratoLaboral.update(
         contratoLaboralData,
         options
      );
      return contratoLaboral;
   }
   async obtenerContratosPorTrabajadorId(id, transaction = null) {
      const options = {
         where: {
            trabajador_id: id,
            estado: 1,
         },
      };
      if (transaction) {
         options.transaction = transaction;
      }
      const contratos = await ContratoLaboral.findAll(options);
      return contratos;
   }
   async eliminarContratoPorId(id, transaction = null) {
      const options = {
         where: { id },
      };
      if (transaction) options.transaction = transaction;
      await ContratoLaboral.update({ estado: 0 }, options);
   }
   async obtenerContratosActivosPorDniEnMes(dni, anio, mes, transaction = null) {
      const { desde, hasta } = periodoMes(anio, mes);

      const options = {
         where: {
            estado: 1,
            [Op.and]: [
               {fecha_inicio: { [Op.lte]: hasta } },
               { [Op.or]: [{ fecha_fin: null}, {fecha_fin: { [Op.gte]: desde } }] },
            ],
         },
         include: [
            {
               model: Trabajador,
               as: "trabajador",
               attributes: ["id", "numero_documento"],
               where: { numero_documento: dni },
               required: true,
            },
         ],
         order: [["fecha_inicio", "ASC"]],
      };
      if (transaction) options.transaction = transaction;
      
      return await ContratoLaboral.findAll(options);
   }
   async obtenerContratosActivosPorTrabajadorEnMes(trabajadorId, anio, mes, transaction = null) {
      const { desde, hasta } = periodoMes(anio, mes);

      const options = {
         where: {
            estado: 1,
            trabajador_id: trabajadorId,
            [Op.and]: [
               { fecha_inicio: { [Op.lte]: hasta } },
               { [Op.or]: [{ fecha_fin: null }, { fecha_fin: { [Op.gte]: desde } }] },
            ],
         },
         order: [["fecha_inicio", "ASC"]],
      };
      if(transaction) options.transaction = transaction;

      return await ContratoLaboral.findAll(options);
   }
}

module.exports = SequelizeContratoLaboralRepository;