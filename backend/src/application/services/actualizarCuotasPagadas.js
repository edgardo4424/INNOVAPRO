const {
  AdelantoSueldo,
} = require("../../modules/adelanto_sueldo/infraestructure/models/adelantoSueldoModel");

async function actualizarCuotasPagadas(
  adelantos_ids = [],
  transaction = null
) {
  
  if (!Array.isArray(adelantos_ids) || adelantos_ids.length === 0) return;

  const registros = await AdelantoSueldo.findAll({
    where: { id: adelantos_ids },
    transaction,
  });

  for (const registro of registros) {

      const registrooo = await registro.update(
        {
          cuotas_pagadas: registro.cuotas_pagadas + 1,
        },
        { transaction }
      );

    
  }
}

module.exports = { actualizarCuotasPagadas };
