
require('dotenv').config();

const { bloquearUndiciYFetch } = require("./utils/bloqueoUndici")

// ✅ Solo lo ejecuta si está activado en el entorno
bloquearUndiciYFetch();

const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const socketHandler = require('./socketHandler');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

socketHandler(io);

// 🔥 Detectamos si estamos en producción o desarrollo
const PORT = process.env.PORT || 3001;
const API_BASE_URL = process.env.API_URL || "http://localhost:3001/api";

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en ${API_BASE_URL}`);
});

// Hola hice un cambio en github :)