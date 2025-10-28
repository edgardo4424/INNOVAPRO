const path = require('path');
const fs = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');

// 📁 Asegurar carpeta de logs
const logDir = path.join(__dirname, '../../../../bitacora/factiliza');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const transport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, 'factiliza-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '10m',
  maxFiles: '30d', // guarda 30 días de logs
  level: 'info', // solo logs info+error
});

// 🎯 Formato del log
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [transport],
});

// 🔧 Helper para registrar logs estructurados
const registrarLogFactiliza = (tipo, data) => {
  try {
    const contenido = JSON.stringify(data, null, 2);
    logger.info(`[${tipo}] ${contenido}`);
  } catch (err) {
    logger.error(`[LOGGER_ERROR_${tipo}] No se pudo escribir log: ${err} content:${contenido ?? '{title: "no se pudo registrar el content"}'}`);
  }
};

module.exports = { registrarLogFactiliza };
