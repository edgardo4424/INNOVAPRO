const SoporteMultiInternoDetalleModel = require("../models/SoporteMultiInternoDetalleModel");
const CalculoQuintaModel = require("../models/CalculoQuintaModel");

class SequelizeSoporteMultiInternoRepository {
  /**
   * Crea el soporte detallado y retorna la fila creada.
   */
  async crearSoporteMultiInterno({ quinta_calculo_id, remu_multi_json, grati_multi_json, af_multi_json, total_ingresos, transaction }) {
    return await SoporteMultiInternoDetalleModel.create(
      {
        quinta_calculo_id,
        remu_multi_json,
        grati_multi_json,
        af_multi_json,
        total_ingresos,
      },
      { transaction }
    );
  }

  /**
   * Actualiza la fila de quinta_calculos con el id del soporte.
   */
  async actualizarQuintaSetSoporteMultiInterno({ quinta_calculo_id, soporte_multi_interno_id, transaction }) {
    const row = await CalculoQuintaModel.findByPk(quinta_calculo_id, { transaction });
    if (!row) {
      const e = new Error("No existe quinta_calculos para enlazar soporte");
      e.status = 404; throw e;
    }
    await row.update({ soporte_multi_interno_id }, { transaction });
    return row;
  }
}

module.exports = SequelizeSoporteMultiInternoRepository;