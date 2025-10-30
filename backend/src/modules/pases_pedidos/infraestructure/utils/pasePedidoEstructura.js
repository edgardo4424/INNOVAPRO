const pasePedidoEstructura = () => ({
  id: null,
  contrato_id: null,
  ref_contrato: "",
  filial: "", // RUC de la filial de Innova
  razon_social: "",
  cliente_ruc: "",
  cliente_razon_social: "",
  guias: [],
  estado: "",
  fecha_confirmacion: "",
});

module.exports = pasePedidoEstructura;
