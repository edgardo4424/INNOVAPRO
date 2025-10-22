const axios = require('axios');

const factilizaClient = axios.create({
    baseURL: process.env.URL_FACTURACION_FACTILIZA,
    timeout: 30000,
    headers: {
        Authorization: `Bearer ${process.env.TOKEN_FACTURACION}`,
        'Content-Type': 'application/json',
    },
});

module.exports = factilizaClient;
