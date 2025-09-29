const { Choferes } = require("../models/choferesModel");

class SequelizeChoferesRepository {
  async crear(chofer) {
    try {
      const existeChofer = await Choferes.findOne({
        where: { nro_doc: chofer.nro_doc },
      });

      if (existeChofer) {
        return {
          success: false,
          message: "El chofer ya existe en la base de datos.",
          data: null,
        };
      }

      const nuevoChofer = await Choferes.create(chofer);
      return {
        success: true,
        message: "El chofer se creó correctamente.",
        data: nuevoChofer,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }

  async actualizar(chofer) {
    try {
      const [updated] = await Choferes.update(chofer, {
        where: { id: chofer.id },
      });

      if (!updated) {
        return {
          success: false,
          message: "El chofer no existe o no se pudo actualizar.",
          data: null,
        };
      }

      const choferActualizado = await Choferes.findByPk(chofer.id);
      return {
        success: true,
        message: "El chofer se actualizó correctamente.",
        data: choferActualizado,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }

  async listar() {
    try {
      const choferes = await Choferes.findAll();
      console.log("choferes", choferes);
      return {
        success: true,
        message: ` ${choferes.length} choferes encontrados.`,
        total: choferes.length,
        data: choferes,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }

  async eliminar(id) {
    try {
      const deleted = await Choferes.destroy({
        where: { id },
      });

      if (!deleted) {
        return {
          success: false,
          message: "El chofer no existe o ya fue eliminado.",
          data: null,
        };
      }

      return {
        success: true,
        message: "El chofer se eliminó correctamente.",
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }
}

module.exports = SequelizeChoferesRepository;
