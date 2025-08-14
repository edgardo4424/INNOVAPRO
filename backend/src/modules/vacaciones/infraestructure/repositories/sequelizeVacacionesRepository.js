const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const {
   Trabajador,
} = require("../../../trabajadores/infraestructure/models/trabajadorModel");
const { Vacaciones } = require("../models/vacacionesModel");

class SequelizeVacacionesRepository {
   async crear(vacacionesData) {
      const vacaciones = await Vacaciones.create(vacacionesData);
      return vacaciones;
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
               model: db.empresas_proveedoras,
               as: "empresa_proveedora",
               required: false,
            },
            {
               model:db.cargos,
               as:"cargo",
               include:[
                  {
                     model:db.areas,
                     as:"area"
                  }
               ]
            },
            {
               model:db.contratos_laborales,
               as:"contratos_laborales"

            }
         ],
      });

      return trabajadoresXvacaciones;
   }
}

module.exports = SequelizeVacacionesRepository;
