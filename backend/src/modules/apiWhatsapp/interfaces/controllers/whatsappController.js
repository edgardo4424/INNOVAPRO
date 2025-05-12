const enviarMensajePrueba = require('../../useCases/enviarMensajePrueba');

const whatsappController = {
  async enviarPrueba(req, res) {
    try {
      const { numero } = req.body;
      const respuesta = await enviarMensajePrueba(numero);
      res.status(200).json(respuesta);
    } catch (error) {
      console.error("Error al enviar WhatsApp:", error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = whatsappController;
