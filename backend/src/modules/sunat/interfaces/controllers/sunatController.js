const buscarRUC = require("../../application/useCases/buscarRUC");
const ejecutarImportacionSunat = require("../../application/useCases/ejecutarImportacionSunat");
const sequelizeSunatRepository = require("../../infrastructure/repositories/sequelizeSunatRepository");
const sunatRepository = new sequelizeSunatRepository();

const sunatController = {
  async buscarPorRUC(req, res) {

    try {
      const resultado = await buscarRUC(req.params.ruc, sunatRepository);
     res.status(resultado.codigo).json(resultado.respuesta);
    } catch (error) {
      console.error("❌ Error al buscar ruc:", error.message);
      res.status(500).json({ mensaje: "❌ Error al buscar los datos por ruc." });
    }

    
  },

  async importarPadron(req, res) {
    try {
      await ejecutarImportacionSunat(); 
      res.status(200).json({ mensaje: "✅ Importación de padrón SUNAT completada." });
    } catch (error) {
      console.error("❌ Error en importación manual:", error.message);
      res.status(500).json({ mensaje: "❌ Error en la importación del padrón SUNAT." });
    }
  }
};

module.exports = sunatController;