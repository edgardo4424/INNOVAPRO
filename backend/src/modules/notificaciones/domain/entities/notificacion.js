class Notificacion {
  constructor({ mensaje, tipo, usuarioId, leida = false }) {
    if (!mensaje || !tipo || !usuarioId) {
      throw new Error("Todos los campos obligatorios deben estar presentes")
    }
    this.mensaje = mensaje
    this.tipo = tipo
    this.usuarioId = usuarioId
    this.leida = leida
  }
}

module.exports = Notificacion