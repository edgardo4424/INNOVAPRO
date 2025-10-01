const { Choferes } = require("../models/choferesModel");
const { Vehiculos } = require("../models/vehiculosModel");
const db = require("../../../../database/models");
const { Op, fn, col } = require('sequelize');

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

      let { id_vehiculo, ...resto } = chofer;
      const nuevoChofer = await Choferes.create(resto);
      if (chofer.id_vehiculo != null && chofer.id_vehiculo != undefined) {
        const vehiculo = await Vehiculos.findByPk(chofer.id_vehiculo);
        vehiculo.id_chofer = nuevoChofer.id;
        await vehiculo.save();
      }

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
    const transaction = await db.sequelize.transaction();
    try {
      const { id_vehiculo, ...datosChofer } = chofer;

      const choferExistente = await Choferes.findByPk(chofer.id, { transaction });

      if (!choferExistente) {
        await transaction.rollback();
        return {
          success: false,
          message: "El chofer no existe.",
          data: null,
        };
      }

      const vehiculoAnterior = await Vehiculos.findOne({
        where: { id_chofer: chofer.id },
        transaction,
      });

      // ✅ Caso 1: El chofer tenía un vehículo asignado
      if (vehiculoAnterior) {
        // Caso A: Se envía un nuevo id_vehiculo distinto
        if (id_vehiculo && id_vehiculo !== vehiculoAnterior.id) {
          // Liberar el anterior
          await vehiculoAnterior.update({ id_chofer: null }, { transaction });

          // Asignar el nuevo si no es null
          await Vehiculos.update(
            { id_chofer: chofer.id },
            { where: { id: id_vehiculo }, transaction }
          );
        }

        // ✅ Caso B: Se envía null → quitar la asignación
        if (id_vehiculo === null) {
          await vehiculoAnterior.update({ id_chofer: null }, { transaction });
        }

        // ✅ Si es el mismo id_vehiculo, no se hace nada
      }

      // ✅ Caso 2: No tenía vehículo antes y se está asignando uno nuevo
      else if (id_vehiculo) {
        await Vehiculos.update(
          { id_chofer: chofer.id },
          { where: { id: id_vehiculo }, transaction }
        );
      }

      // ✅ Actualizar los datos del chofer
      const [updated] = await Choferes.update(datosChofer, {
        where: { id: chofer.id },
        transaction,
      });

      if (!updated) {
        await transaction.rollback();
        return {
          success: false,
          message: "El chofer no se pudo actualizar.",
          data: null,
        };
      }

      await transaction.commit();

      const choferActualizado = await Choferes.findByPk(chofer.id);
      return {
        success: true,
        message: "El chofer se actualizó correctamente.",
        data: choferActualizado,
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }
  }

  async listar() {
    try {
      const choferes = await Choferes.findAll({
        include: {
          model: Vehiculos,
          attributes: ["id", "nro_placa", "marca", "color", "id_chofer"],
        },
      });
      
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
      // ? 1. Buscar vehículo asociado y desvincular chofer
      const vehiculo = await Vehiculos.findOne({ where: { id_chofer: id } });
      if (vehiculo) {
        await vehiculo.update({ id_chofer: null });
      }
      // ? 2. Eliminar al chofer
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
