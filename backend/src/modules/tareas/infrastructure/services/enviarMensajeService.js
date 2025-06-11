const axios = require("axios");

const WHATSAPP_TOKEN = 'EAAYlYX2AvjIBO7XLCc44GygKx57RFbBSgzOkzaWlnbXfYKKPbMV5CNq2KkjtY0cZC6e9crTZCflVZBdYzxDU0tn7ux6lvUoKAP5cOEQ5uwu3RqouYwHEs9kKUZAua46CTdqZBguyfqFl2xlL0bVFIeFONvWa6kjpWbpTwWtRR0SQ45CgZAXWmrVy4jW26Ayeyr8O0o9HaBQ6C3ZCE0j2Bo5Jp6SrSm6JlsJbmgZD'; // Tu token real
const PHONE_NUMBER_ID = '603147202891611';

module.exports = async (to, nombre, tareaN) => {
    console.log("✅ [enviarMensajeService] Iniciando envío de WhatsApp...");
    console.log("➡️  Enviando a:", to);
    console.log("➡️  Con nombre:", nombre);
    console.log("➡️  Con rol:", tareaN);

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to,
                type: "template",
                template: {
                    name: "hello_world", // Debe coincidir exactamente
                    language: { code: "en_US" }, // ← Cambiado de es_PE a en_US
                   /*  components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", text: nombre },
                                { type: "text", text: tareaN }
                            ]
                        }
                    ] */
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
