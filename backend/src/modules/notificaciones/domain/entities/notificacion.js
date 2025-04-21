class Notificacion {
  constructor({ titulo, mensaje, tipo, usuario_id, leida = false }) {
    if (!titulo || !mensaje || !tipo || !usuario_id) {
      throw new Error("Todos los campos obligatorios deben estar presentes")
    }
    this.titulo = titulo
    this.mensaje = mensaje
    this.tipo = tipo
    this.usuario_id = usuario_id
    this.leida = leida
  }
}

module.exports = Notificacion