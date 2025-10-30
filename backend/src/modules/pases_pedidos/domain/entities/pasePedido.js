class PasePedido {
  constructor({ contrato_id, fecha_confirmacion, estado }) {
    this.contrato_id = contrato_id;
    this.fecha_confirmacion = fecha_confirmacion;
    this.estado = estado;
  }

  validarCamposObligatorios() {
    let errores = [];
    if (!this.contrato_id) {
      errores.push("El ID del contrato es obligatorio.");
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
      fecha_confirmacion: this.fecha_confirmacion||null,
      estado: this.estado,
    };
  }
}

module.exports = PasePedido;
