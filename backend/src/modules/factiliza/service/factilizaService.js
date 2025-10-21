const factilizaCliente = require('../api/apiFactilizaFacturacion');

const factilizaService = {

    enviarFactura: async (factura) => {
        const res = await factilizaCliente.post("/invoice/send", factura);
        return res.data;
    },

    enviarNota: async (nota) => {
        const res = await factilizaCliente.post("/note/send", nota);
        return res.data;
    },

    enviarGuia: async (guia) => {
        const res = await factilizaCliente.post("/despatch/send", guia);
        return res.data;
    },
}

module.exports = factilizaService
