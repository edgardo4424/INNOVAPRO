const { Obra } = require("../models/obraModel");
const db = require("../../../../models"); // Llamamos los modelos sequalize de la base de datos

class SequelizeObraRepository {
    getModel() {
        return require('../models/obraModel').Obra; // Retorna el modelo de cliente
    }

    async crear(obraData) {
          return await Obra.create(obraData);
      }
      

    async obtenerObras() {

        const obras = Obra.findAll();
       
        return obras
    }

    async obtenerPorId(id) {
        return await Obra.findByPk(id); // Llama al método del repositorio para obtener un cliente por ID
    }

    async obtenerPorRuc(ruc){
        return await Obra.findOne({ where: { ruc } });
    }

    async actualizarObra(id, obraData) {
        const obra = await Obra.findByPk(id); // Busca el obra por ID
        if (!obra) { // Si no se encuentra el obra, retorna null
          console.log("❌ Obra no encontrado");
          return null; 
        }
        await obra.update(obraData); // Actualiza el obra con los nuevos datos
        return obra; // Retorna el obra actualizado
      }

    async eliminarObra(id) {
        const obra = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el obra por ID
        if (!obra) return null; // Si no se encuentra el obra, retorna null
        return await obra.destroy(); // Elimina el obra y retorna el resultado
    }
}

module.exports = SequelizeObraRepository; // Exporta la clase para que pueda ser utilizada en otros módulos