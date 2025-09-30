const separar_planilla_honorarios = (planillaMensualCerradas) => {
  let pl = [];
  let rh = [];
  for (const p of planillaMensualCerradas) {
    if (p.tipo_contrato == "HONORARIOS") {
      rh.push(p.get({ plain: true }));
    }
    if (p.tipo_contrato == "PLANILLA") {
      pl.push(p.get({ plain: true }));
    }
  }

  return {
    pl,
    rh,
  };
};

module.exports = separar_planilla_honorarios;
