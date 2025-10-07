const axios = require('axios');

const asistenciaClient = axios.create({
    baseURL: "https://marcate.grupoinnova.pe/backend/api/data_publica/",
    headers: {
      Authorization:
        "ApiKey marcate_sk_51a43bbf0d3b2e34b42a24fb89fd29b0a4ca551adcb2a89f5e418253cbad5788",
    },
    timeout: 4000,
});

module.exports = asistenciaClient;