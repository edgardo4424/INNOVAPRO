const { bot } = require("../../../../shared/utils/botTelegram");

/* const TelegramBot = require("node-telegram-bot-api");
 */
function enviarNotificacionTelegram(id_chat, mensaje) {
    
    /* const bot = new TelegramBot(
         process.env.TELEGRAM_SECRET_KEY
      ); */
     
      bot.sendMessage(id_chat, mensaje);
   
}

module.exports = {
    enviarNotificacionTelegram
};