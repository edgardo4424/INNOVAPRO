const db = require("../../../../../database/models");

async function datosParaPdfColgante({ contrato_id, transaction = null }) {
  const contrato = await db.contratos.findByPk(contrato_id, {
    include: [
      {
        model: db.obras,
        as: "obra",
      },
      { 
        model: db.usuarios, 
        as: "usuario" 
      },
    ],
  });

  return contrato;
}

module.exports = {
  datosParaPdfColgante,
};
