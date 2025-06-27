

//https://t.me/innovaproBot?start=52

require("dotenv").config();

const {
  enviarNotificacionDeAutenticacionTelegram,
} = require("../../modules/notificaciones/infrastructure/services/enviarNotificacionDeAutenticacionTelegram");

const sequelizeUsuarioRepository = require("../../modules/usuarios/infrastructure/repositories/sequelizeUsuarioRepository");
const usuarioRepository = new sequelizeUsuarioRepository();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_SECRET_KEY, { polling: true });

bot.onText(/^\/start(?:\s+(\d+))?$/, async (msg, match) => {
   
  const param = match[1]; // '45' ó undefined
  const chatId = msg.chat.id;

  console.log("chatId", chatId);

  const userId = param;

  console.log("➡️  Llego /start con param:", userId);

  if (!param) {
    return bot.sendMessage(
      chatId,
      "ℹ️ Abre el enlace “Conectar con Telegram” desde tu panel primero."
    );
  }

  // 1) Comprueba que existe y aún no está vinculado
  const usuario = await usuarioRepository.obtenerPorId(userId);

  console.log("usuario", usuario);

  if (!usuario) {
    return bot.sendMessage(chatId, "⚠️ Este usuario no existe");
  }

  if (usuario.id_chat) {
    const mensaje = `Tu usuario ya fue vinculado anteriormente. 😒`;
    // Enviar mensaje por telegram
    bot.sendMessage(chatId, mensaje);
    const notificacionParaElCreador = {
      usuarioId: usuario.id,
      mensaje: mensaje,
      succes: false,
    };
    enviarNotificacionDeAutenticacionTelegram(
      userId,
      notificacionParaElCreador
    );
    return;
  }

  // 2) Inserta o actualiza
  await usuarioRepository.actualizarIdChatTelegramUsuario(usuario.id, chatId);

  const mensaje = `Se vinculó correctamente, desde ahora podrá recibir las notificaciones por Telegram. 😊`;

  // Enviar mensaje por telegram
  bot.sendMessage(chatId, mensaje);

  // Enviar mensaje por el ERP

  const notificacionParaElCreador = {
    usuarioId: usuario.id,
    mensaje: mensaje,
    succes: true,
  };


  enviarNotificacionDeAutenticacionTelegram(userId, notificacionParaElCreador);
});

module.exports = { bot };