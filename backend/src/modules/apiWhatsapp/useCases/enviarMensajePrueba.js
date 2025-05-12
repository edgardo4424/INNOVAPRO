const whatsappService = require('../domain/whatsappService');

const enviarMensajePrueba = async (numero) => {
  if (!numero) throw new Error("Número requerido");
  return await whatsappService.enviarMensaje(numero);
};

module.exports = enviarMensajePrueba;