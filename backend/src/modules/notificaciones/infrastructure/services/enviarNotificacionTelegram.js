const { bot } = require("../../../../shared/utils/botTelegram");

async function enviarNotificacionTelegram(id_chat, mensaje) {
  return await bot.sendMessage(id_chat, mensaje);  
}

module.exports = {
   enviarNotificacionTelegram,
};