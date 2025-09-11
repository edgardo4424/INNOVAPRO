
const {
  AdelantoSueldo,
} = require("../../modules/adelanto_sueldo/infraestructure/models/adelantoSueldoModel");
const { isCuotaAplicable } = require("../../modules/adelanto_sueldo/infraestructure/repositories/utils/validarCuotaAplicable");

async function actualizarCuotasPagadas(adelantos_ids = [], fecha_anio_mes, transaction = null) {

  if (!Array.isArray(adelantos_ids) || adelantos_ids.length === 0) return;

  const registros = await AdelantoSueldo.findAll({
    where: { id: adelantos_ids },
    transaction,
  });

  for (const registro of registros) {

    const aplica = isCuotaAplicable(
      registro.primera_cuota,
      registro.cuotas,
      fecha_anio_mes,
      registro.forma_descuento
    );

    if (aplica) {
      
   const registrooo =  await registro.update(
      {
        cuotas_pagadas: registro.cuotas_pagadas + 1,
      },
      { transaction }
    );
    
    console.log('registrooooo', registrooo);
    console.log(`✅ Adelanto ID ${registro.id} actualizado.`);
  }
}
}

module.exports = { actualizarCuotasPagadas };
