const { Despiece } = require("../models/despieceModel");

class SequelizeDespieceRepository {
    getModel() {
        return require('../models/despieceModel').Despiece; // Retorna el modelo de cliente
    }

    async crear(despieceData) {
          return await Despiece.create(despieceData);
      }
    
    async obtenerDespieces() {
        return await Despiece.findAll();
    }

    async obtenerPorId(id) {
        return await Despiece.findByPk(id); // Llama al método del repositorio para obtener un cliente por ID
    }

    async actualizarDespiece(id, despieceData) {
        const despiece = await Despiece.findByPk(id); // Busca el despiece por ID
        if (!despiece) { // Si no se encuentra el despiece, retorna null
          console.log("❌ Despiece no encontrado");
          return null; 
        }
        await despiece.update(despieceData); // Actualiza el despiece con los nuevos datos
        return despiece; // Retorna el despiece actualizado
      }

    async eliminarDespiece(id) {
        const despiece = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el despiece por ID
        if (!despiece) return null; // Si no se encuentra el despiece, retorna null
        return await despiece.destroy(); // Elimina el despiece y retorna el resultado
    }
}

module.exports = SequelizeDespieceRepository; // Exporta la clase para que pueda ser utilizada en otros módulos