
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});