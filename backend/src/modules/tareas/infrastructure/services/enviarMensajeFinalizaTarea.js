const axios = require("axios");

const WHATSAPP_TOKEN = 'EAAYlYX2AvjIBO9e9ZCMmqAdNwavZAZC2i4fgkZBZBdnsf4tyJRS2kQnrSoohpIAq1IDh8QU9jcklEjX8oz5KrGy8gjg7wHhvstZAo7SkZCcpNMXTI1sI2XvqDd3buEYCeVQgpNXLnUJ0JikcO6kA1XWIirWTygloXZCfSqZBZBXilK2hZBazQ4JBhmtUR546CunsQScrdvQoqpCSzz5AbSNHZCZA2D7TCd2Nw85ZABp4EZD'; // Tu token real
const PHONE_NUMBER_ID = '603147202891611';

module.exports = async (to, nombre, tareaN) => {
  console.log("✅ [enviarMensajeService] Iniciando envío de WhatsApp...");
  console.log("➡️  Enviando a:", to);
  console.log("➡️  Con nombre:", nombre);
  console.log("➡️  Con tareaN:", tareaN);

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: "finalizar_tarea", // Asegúrate que coincida con el nombre en Meta
          language: { code: "es_PE" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: nombre },
                { type: "text", text: tareaN }
              ]
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ [enviarMensajeService] Mensaje enviado correctamente");
    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error("❌ [enviarMensajeService] Error al enviar mensaje:");
    
    if (error.response) {
      console.error("➡️ Código de estado:", error.response.status);
      console.error("➡️ Respuesta:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error("❌ No hubo respuesta de la API de WhatsApp");
      console.error(error.request);
    } else {
      console.error("❌ Error al configurar la petición:", error.message);
    }

    throw error; // Propaga el error si necesitas manejarlo en otro lado
  }
};
