class PasePedido {
  constructor({ contrato_id, fecha_emision, estado }) {
    this.contrato_id = contrato_id;
    this.fecha_emision = fecha_emision;
    this.estado = estado;
  }

  validarCamposObligatorios() {
    let errores = [];
    if (!this.contrato_id) {
      errores.push("El ID del contrato es obligatorio.");
    }
    if (!this.fecha_emision) {
      errores.push("La fecha de emisión es obligatoria.");
    }
    const estados = ["Por confirmar", "Pre confirmado", "Confirmado"];
    if (!estados.includes(this.estado)) {
      errores.push(`El estado ${this.estado} no existe.`);
    }
    console.log("Errores obtenidos: ", errores);

    return errores;
  }
  get() {
    return {
      contrato_id: this.contrato_id,
      fecha_emision: this.fecha_emision,
      estado: this.estado,
    };
  }
}

module.exports = PasePedido;
