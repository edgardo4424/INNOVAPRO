require('dotenv').config(); //Llamamos las variables de entorno

const axios = require('axios');

const asistenciaClient = axios.create({
    baseURL: "https://marcate.grupoinnova.pe/backend/api/data_publica/",
    headers: {
      Authorization: 
        `ApiKey ${process.env.API_KEY_SINCRONIZAR_MARCATE}`,
    },
    timeout: 4000,
});

module.exports = asistenciaClient;