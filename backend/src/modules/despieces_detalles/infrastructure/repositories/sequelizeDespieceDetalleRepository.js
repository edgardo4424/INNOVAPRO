const { DespieceDetalle } = require("../models/despieceDetalleModel");

class sequelizeDespieceDetalleRepository {
    getModel() {
        return require('../models/despieceDetalleModel').DespieceDetalle; // Retorna el modelo de cliente
    }

    async crear(despieceDetalleData) {
          return await DespieceDetalle.create(despieceDetalleData);
      }
    
    async obtenerDespiecesDetalle() {
        return await DespieceDetalle.findAll();
    }

    async obtenerPorId(id) {
        return await DespieceDetalle.findByPk(id); // Llama al método del repositorio para obtener un cliente por ID
    }

    async actualizarDespieceDetalle(id, despieceDetalleData) {
        const despieceDetalle = await DespieceDetalle.findByPk(id); // Busca el despieceDetalle por ID
        if (!despieceDetalle) { // Si no se encuentra el despieceDetalle, retorna null
          console.log("❌ Despiece Detalle no encontrado");
          return null; 
        }
        await despieceDetalle.update(despieceDetalleData); // Actualiza el despieceDetalle con los nuevos datos
        return despieceDetalle; // Retorna el despieceDetalle actualizado
      }

    async eliminarDespieceDetalle(id) {
        const despieceDetalle = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el despieceDetalle por ID
        if (!despieceDetalle) return null; // Si no se encuentra el despieceDetalle, retorna null
        return await despieceDetalle.destroy(); // Elimina el despieceDetalle y retorna el resultado
    }

    async crearVariosDespiecesDetalles(listaDespiecesDetalles) {
        return await DespieceDetalle.bulkCreate(listaDespiecesDetalles, {
          validate: true // Opcional: valida cada instancia antes de insertarla
        });
      }
}

module.exports = sequelizeDespieceDetalleRepository; // Exporta la clase para que pueda ser utilizada en otros módulos