const axios = require('axios');

const factilizaClient = axios.create({
    baseURL: process.env.URL_CONSULTA_FACTILIZA,
    timeout: 10000,
    headers: {
        Authorization: `Bearer ${process.env.TOKEN_FACTILIZA}`,
        'Content-Type': 'application/json',
    },
});

module.exports = factilizaClient;
