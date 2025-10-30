const pedidoGuiaEstructura = () => ({
    id: null,
    contrato_id: null,
    ref_contrato: "",
    filial: "",
    razon_social: "",
    cliente_ruc: "",
    cliente_razon_social: "",
    pedido_guia_id: null,
    guia_nro: "",
    estado: "", // "Emitido" o "Pendiente"
    fecha_emision_guia: "", // Fecha y hora (puede venir de la guía)
    fecha_despacho: null,
    fecha_confirmacion:null
});

module.exports = pedidoGuiaEstructura;
