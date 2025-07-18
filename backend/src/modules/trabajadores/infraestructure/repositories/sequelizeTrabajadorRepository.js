const { Trabajador } = require("../models/trabajadorModel");
const db = require("../../../../models");
const EmpresaProveedora = db.empresas_proveedoras;
const hoy = new Date();
const fechaHoy = hoy.toISOString().slice(0, 10);
const { Op, fn, col, where } = require("sequelize");
class SequelizeTrabajadorRepository {
   async crear(trabajadorData) {
      console.log("sequalize", trabajadorData);

      const trabajador = await Trabajador.create(trabajadorData);
      return trabajador;
   }
   async obtenerTrabajadoresPorFilial(filialId) {
      const trabajadores = await Trabajador.findAll({
         where: { filial_id: filialId },
         include: [
            {
               model: db.asistencias,
               as: "asistencias",
               required: false,
               where: where(fn("DATE", col("asistencias.fecha")), fechaHoy),
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
         ],
      });

      // Convertir asistencia de arreglo a objeto único (si existe)
      const resultado = trabajadores.map((t) => {
         const data = t.toJSON();
         data.asistencia = data.asistencias?.[0] || null;
         delete data.asistencias;
         return data;
      });

      console.log(resultado);

      return resultado;
   }
}

module.exports = SequelizeTrabajadorRepository;


// {
//   "id": 4,
//   "filial_id": 2,
//   "nombres": "Carlos",
//   "apellidos": "Ramírez",
//   "tipo_documento": "DNI",
//   "numero_documento": "12345678",
//   "fecha_ingreso": "2024-06-15",
//   "fecha_salida": null,
//   "sueldo_base": 2800,
//   "asignacion_familiar": true,
//   "sistema_pension": "AFP",
//   "quinta_categoria": false,
//   "estado": "activo",
//   "asistencia": {
//     "id": 1,
//     "trabajador_id": 4,
//     "fecha": "2025-07-11T15:00:00.000Z",
//     "horas_trabajadas": 5.5,
//     "estado_asistencia": "falto",
//     "gastos": [],
//     "jornadas": []
//   }
// }