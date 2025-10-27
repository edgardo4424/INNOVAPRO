const crearEnvioPedido = require("../../../../application/services/crearEnvioPedido");

const PedidoGuiaController = {
  async crearEnvioPedido(req, res) {    
    try {
      const response = await crearEnvioPedido(req.body);
      res.status(response.codigo).json(response.respuesta);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports=PedidoGuiaController