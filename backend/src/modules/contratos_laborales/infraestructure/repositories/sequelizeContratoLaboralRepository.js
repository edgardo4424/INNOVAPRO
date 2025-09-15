const { Sequelize, Op } = require("sequelize");
const { ContratoLaboral } = require("../models/contratoLaboralModel");

class SequelizeContratoLaboralRepository {
  async crear(contratoLaboralData, transaction = null) {
    const options = {};
    if (transaction) {
      options.transaction = transaction;
    }
    const contratoLaboral = await ContratoLaboral.create(
      contratoLaboralData,
      options
    );
    return contratoLaboral;
  }
  async editarContratoLaboral(contratoLaboralData, transaction = null) {
    const options = { where: { id: contratoLaboralData.contrato_id } };
    if (transaction) {
      options.transaction = transaction;
    }
    console.log(contratoLaboralData);

    const contratoLaboral = await ContratoLaboral.update(
      contratoLaboralData,
      options
    );
    return contratoLaboral;
  }
  async obtenerContratosPorTrabajadorId(id, transaction = null) {
    const options = {
      where: {
        trabajador_id: id,
        estado: 1,
      },
    };
    if (transaction) {
      options.transaction = transaction;
    }
    const contratos = await ContratoLaboral.findAll(options);
    return contratos;
  }
  async eliminarContratoPorId(id, transaction = null) {
    const options = {
      where: { id },
    };
    if (transaction) options.transaction = transaction;
    await ContratoLaboral.update({ estado: 0 }, options);
  }

  async obtenerUltimoContratoVigentePorTrabajadorId(id, transaction = null) {
    const options = {
      where: {
        trabajador_id: id,
        estado: 1,
      },
      order: [["fecha_inicio", "DESC"]],
    };
    if (transaction) {
      options.transaction = transaction;
    }
    const contrato = await ContratoLaboral.findOne(options);
    console.log("contrato", contrato);
    return contrato;
  }

async obtenerHistoricoContratosDesdeUltimaAlta(trabajador_id, transaction = null) {
  const options = {
    where: {
      trabajador_id,
      estado: 1,
    },
    order: [['fecha_inicio', 'DESC']],
  };

  if (transaction) {
    options.transaction = transaction;
  }

  const contratos = await ContratoLaboral.findAll(options);

  if (!contratos || contratos.length === 0) return [];

  const contratosFiltrados = [];

  for (const contrato of contratos) {
    // Si hubo baja, ya no consideramos más contratos hacia atrás
    if (contrato.fecha_terminacion_anticipada) break;

    contratosFiltrados.push(contrato);
  }

  return contratosFiltrados;
}
}

module.exports = SequelizeContratoLaboralRepository;
