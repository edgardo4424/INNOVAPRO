
const moment = require("moment");

function correspondeGratiTrunca(fechaBaja, trabajador_id, filial_id, transaction) {
  const baja = moment(fechaBaja, "YYYY-MM-DD");
  const mes = baja.month() + 1; // moment empieza en 0
  const anio = baja.year();

  // 🔹 Caso especial: Diciembre después del 15
  if (mes === 12 && baja.date() > 15) {
    return false;
  }

  // 🔹 Caso especial: Enero (validar si ya tuvo grati diciembre del año anterior)
  if (mes === 1) {
    const periodoDiciembre = `${anio - 1}-12`;
    return db.gratificaciones.findOne({
      where: { trabajador_id, periodo: periodoDiciembre, filial_id },
      transaction,
    }).then(grati => !grati); // si ya existe, no corresponde
  }

  return true;
}

module.exports = { correspondeGratiTrunca };