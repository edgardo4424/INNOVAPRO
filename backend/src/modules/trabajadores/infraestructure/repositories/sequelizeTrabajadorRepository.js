const { Trabajador } = require("../models/trabajadorModel");
const db = require("../../../../models");
const EmpresaProveedora = db.empresas_proveedoras;
const { Op, fn, col, where } = require("sequelize");
class SequelizeTrabajadorRepository {
   async crear(trabajadorData, transaction = null) {
      const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
      const trabajador = await Trabajador.create(trabajadorData, options);
      return trabajador;
   }

   async editar(trabajadorData, transaction = null) {
      const options = { where: { id: trabajadorData.trabajador_id } };
      if (transaction) {
         options.transaction = transaction;
      }
      const trabajador = await Trabajador.update(trabajadorData, options);
      return trabajador;
   }

   async obtenerTrabajadorPorId(id) {
      const trabajador = await Trabajador.findOne({
         where: { id: id },
         include: [
            {
               model: db.contratos_laborales,
               as: "contratos_laborales",
               where: { estado: 1 },
               required: false,
            },
         ],
      });
      return trabajador;
   }
   async obtenerTrabajadoresPorArea(areaId, fecha) {
      const trabajadores = await Trabajador.findAll({
         include: [
            {
               model: db.asistencias,
               as: "asistencias",
               required: false,
               where: where(fn("DATE", col("asistencias.fecha")), fecha),
               include: [
                  { model: db.gastos, as: "gastos" },
                  {
                     model: db.jornadas,
                     as: "jornadas",
                     include: [
                        {
                           model: db.tipos_trabajo,
                           as: "tipo_trabajo",
                           required: false,
                        },
                     ],
                  },
               ],
            },
            {
               model: db.cargos,
               as: "cargo",
               required: true,
               where: {
                  area_id: areaId, // <--- filtro aquí por area_id
               },
            },
         ],
      });

      // Convertir asistencia de arreglo a objeto único (si existe)
      const resultado = trabajadores.map((t) => {
         const data = t.toJSON();
         data.asistencia = data.asistencias?.[0] || null;
         delete data.asistencias;
         return data;
      });
      return resultado;
   }

   async obtenerTrabajadores() {
      const trabajadores = await Trabajador.findAll({
         where:{
            estado:"activo",
         },
         include: [
            {
               model: db.cargos,
               as: "cargo",
               include: [
                  {
                     model: db.areas,
                     as: "area",
                  },
               ],
            },
         ],
      });
      return trabajadores;
   }
}

module.exports = SequelizeTrabajadorRepository;
