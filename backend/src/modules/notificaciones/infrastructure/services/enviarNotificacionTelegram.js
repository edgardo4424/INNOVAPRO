const { bot } = require("../../../../shared/utils/botTelegram");

/* const TelegramBot = require("node-telegram-bot-api");
 */
async function enviarNotificacionTelegram(id_chat, mensaje) {
  try {
    if (!id_chat) return;
    return await bot.sendMessage(id_chat, mensaje);
  } catch (error) {
    console.error("Error al enviar mensaje por Telegram:", error.message);
  }
}

module.exports = {
    enviarNotificacionTelegram
};