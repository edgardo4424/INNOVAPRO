class Contrato {
  constructor({
    id,
    cotizacion_id,
    ref_contrato,
    fecha_inicio,
    fecha_fin,
    clausulas_adicionales,
    requiere_valo_adelantada,
    notas_legales,
    renovaciones,
    estado,
  }) {
    this.id = id;
    this.cotizacion_id = cotizacion_id;
    this.ref_contrato = ref_contrato;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin = fecha_fin;
    this.clausulas_adicionales = clausulas_adicionales;
    this.requiere_valo_adelantada = requiere_valo_adelantada;
    this.notas_legales = notas_legales;
    this.renovaciones = renovaciones;
    this.estado = estado;
  }
  validar(editar = false) {
    let errores = [];
    if (editar) {
      if (!this.id) {
        errores.push("Al actualizar un contrato id es requerrido");
      }
    }
    if (!this.cotizacion_id) {
      errores.push("Para crear un contrato es necesario una cotización");
    }
    if (!this.ref_contrato) {
      errores.push("El codigo del contrato es obligatoria");
    }
    if (!this.fecha_inicio) {
      errores.push("La fecha de inicio del contrato es obligatoria");
    }

    if (!this.fecha_fin) {
      errores.push("La fecha de fin del contrato es obligatoria");
    }

    const listaEstadosPermitidos = [
      "PROGRAMADO",
      "VIGENTE",
      "POR VENCER",
      "VENCIDO",
      "FIRMADO",
    ];
    if (this.estado && !listaEstadosPermitidos.includes(this.estado)) {
      errores.push(
        `El estado del contrato debe ser uno de los siguientes: ${listaEstadosPermitidos.join(
          ", "
        )}`
      );
    }
    return errores;
  }

}

module.exports = Contrato;
