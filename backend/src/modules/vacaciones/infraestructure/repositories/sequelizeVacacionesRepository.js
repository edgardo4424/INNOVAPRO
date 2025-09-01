const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const {
   Trabajador,
} = require("../../../trabajadores/infraestructure/models/trabajadorModel");
const { Vacaciones } = require("../models/vacacionesModel");
const SequelizeDataMantenimientoRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");

const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

class SequelizeVacacionesRepository {
   async crear(vacacionesData, importe_dias_vendidos) {      
      vacacionesData.importe_dias_vendidos = importe_dias_vendidos;
      const vacaciones = await Vacaciones.create(vacacionesData);
      return true;
   }

   async obtenerVacacionesTrabajadores() {
      const trabajadoresXvacaciones = await Trabajador.findAll({
         include: [
            {
               model: db.vacaciones,
               as: "vacaciones",
               required: false,
            },
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
            {
               model: db.contratos_laborales,
               as: "contratos_laborales",
               where: { estado: 1 },
               include: {
                  model: db.empresas_proveedoras,
                  as: "empresa_proveedora",
               },
            },
         ],
      });

      return trabajadoresXvacaciones;
   }
}

module.exports = SequelizeVacacionesRepository;
