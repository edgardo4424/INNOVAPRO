const unificarContratos = (contratos) => {
  // Ordenamos por fecha_inicio para detectar consecutivos
  contratos.sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));

  let resultado = [];
  let grupo = null;

  for (let contrato of contratos) {
    if (!grupo) {
      grupo = { ...contrato,ids_agrupacion: [contrato.id] };
      continue;
    }

    let fechaFinGrupo = new Date(grupo.fecha_fin);
    let fechaInicioContrato = new Date(contrato.fecha_inicio);

    if (
      fechaInicioContrato.getTime() <= fechaFinGrupo.getTime() + 24 * 60 * 60 * 1000
    ) {
      grupo.id=contrato.id
      grupo.fecha_fin = new Date(
        Math.max(new Date(grupo.fecha_fin), new Date(contrato.fecha_fin))
      ).toISOString().split("T")[0];

      grupo.fecha_inicio = new Date(
        Math.min(new Date(grupo.fecha_inicio), new Date(contrato.fecha_inicio))
      ).toISOString().split("T")[0];

      grupo.sueldo = Math.max(grupo.sueldo, contrato.sueldo);
      grupo.ids_agrupacion.push(contrato.id);
      grupo.regimen=contrato.regimen
      if (contrato.fecha_terminacion_anticipada) {
          grupo.fecha_terminacion_anticipada = contrato.fecha_terminacion_anticipada;
      }  
    } else {
      resultado.push(grupo);
      grupo = { ...contrato ,ids_agrupacion: [contrato.id]};
    }
  }

  if (grupo) resultado.push(grupo);  

  return resultado.map((c) => ({
    id:c.id,
    trabajador_id: c.trabajador_id,
    fecha_inicio: c.fecha_inicio,
    fecha_fin: c.fecha_fin,
    banco:c.banco,
    numero_cuenta:c.numero_cuenta,
    sueldo: c.sueldo,
    regimen: c.regimen,
    ids_agrupacion: c.ids_agrupacion.length > 1 ? c.ids_agrupacion : null,
    fecha_terminacion_anticipada:c.fecha_terminacion_anticipada
  }));
};

module.exports = unificarContratos;

