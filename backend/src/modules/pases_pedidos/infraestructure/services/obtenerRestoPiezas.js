const db = require("../../../../database/models");
const {
  PedidoGuia,
} = require("../../../pedidos_guias/infraestructure/models/pedidoGuiaModel");
const restarInventarioYDetectarFaltantes = require("../utils/restarInventarioYDetectarFaltantes");
const sumarPiezas = require("../utils/sumar_piezas");

const obtenerRestoPiezas = async (lote_piezas, contrato_id) => {
  const response_pedidos_guias = await PedidoGuia.findAll({
    where: { contrato_id },
    include: [
      {
        model: db.guias_de_remision,
        as: "guia_remision",
        include: [{ model: db.guia_detalles }],
      },
    ],
  });
  let pedidos_guias = [];
  for (const pedido of response_pedidos_guias) {
    const data = pedido.get({ plain: true });
    pedidos_guias.push(data.guia_remision.guia_detalles);
  }
  const suma_pedidos_anteriores = sumarPiezas(pedidos_guias);
  const RESTO_PIEZAS=restarInventarioYDetectarFaltantes (lote_piezas,suma_pedidos_anteriores)
  return RESTO_PIEZAS.resta.filter((p)=>p.cantidad>0);
  
};

module.exports = obtenerRestoPiezas;
