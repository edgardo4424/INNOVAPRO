const { Filial } = require("../models/filialModel");

class SequelizeFilialRepository {
    getModel() {
        return require('../models/filialModel').Filial; // Retorna el modelo de cliente
    }

    async crear(filialData) {
        try {
          return await Filial.create(filialData);
        } catch (error) {
          console.error("❌ Error al crear filial:", error.message);
          console.error("🔍 Detalles:", error.original?.sqlMessage || error);
          throw error;
        }
      }

    async obtenerFiliales() {
        return await Filial.findAll();
    }

    async obtenerPorId(id) {
        return await Filial.findByPk(id); // Llama al método del repositorio para obtener un cliente por ID
    }

    async obtenerPorRuc(ruc) {
      return await Filial.findOne({ where: { ruc: ruc } });
  }

    async actualizarFilial(id, filialData) {
        const filial = await Filial.findByPk(id); // Busca el filial por ID
        if (!filial) { // Si no se encuentra el filial, retorna null
          console.log("❌ Filial no encontrado");
          return null; 
        }
        await filial.update(filialData); // Actualiza el filial con los nuevos datos
        return filial; // Retorna el filial actualizado
      }

    async eliminarFilial(id) {
        const filial = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el filial por ID
        if (!filial) return null; // Si no se encuentra el filial, retorna null
        return await filial.destroy(); // Elimina el filial y retorna el resultado
    }
}

module.exports = SequelizeFilialRepository; // Exporta la clase para que pueda ser utilizada en otros módulos