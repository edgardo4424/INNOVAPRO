module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('🟢 Cliente conectado:', socket.id);
  
      socket.on('mensaje', (data) => {
        io.emit('mensaje', data);
      });
  
      socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado');
      });
    });
  };