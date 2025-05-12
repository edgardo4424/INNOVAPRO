const axios = require("axios");

const whatsappService = {
  async enviarMensaje(numero) {
    const token = "EAAdiXybMQaoBO8Fn0GcxyK5OlJRNhi2MfpoZCQMJ7uOmO0dxIZCJBF0f1TUes5pGAyfK0WI8Rww8m01hyCYwwzsbEJNPjwEmYle4FdZAPw8fqEBSyohCjmLclyzzkzbmh352FwlYY26GSQruOwxSHRFEI1fZAyTMmqHzIoRFZCSUEJCZCiFjkaLJ7cgOMd1Xa4f3QFU2oDCSZCf1wzczEUD4kPZBZBsoZD"; 
    const mensaje = {
      messaging_product: "whatsapp",
      to: numero,
      type: "template",
      template: {
        name: "hello_world",
        language: { code: "en_US" }
      }
    };

    const response = await axios.post(
      "https://graph.facebook.com/v17.0/684770544714277/messages",
      mensaje,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  }
};

module.exports = whatsappService;
