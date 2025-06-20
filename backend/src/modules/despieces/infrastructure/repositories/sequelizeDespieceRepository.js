const { Despiece } = require("../models/despieceModel");

class SequelizeDespieceRepository {
  getModel() {
    return require("../models/despieceModel").Despiece; // Retorna el modelo de cliente
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

  async actualizarDespiece(id, despieceData, transaction = null) {
    const despiece = await Despiece.findByPk(id);

    if (!despiece) {
      console.log("❌ Despiece no encontrado");
      return null;
    }

    // Si te mandaron transaction, úsalo
    if (transaction) {
      await despiece.update(despieceData, { transaction });
    } else {
      await despiece.update(despieceData);
    }

    return despiece;
  }

  async eliminarDespiece(id) {
    const despiece = await this.obtenerPorId(id); // Llama al método del repositorio para obtener el despiece por ID
    if (!despiece) return null; // Si no se encuentra el despiece, retorna null
    return await despiece.destroy(); // Elimina el despiece y retorna el resultado
  }
}

module.exports = SequelizeDespieceRepository; // Exporta la clase para que pueda ser utilizada en otros módulos
