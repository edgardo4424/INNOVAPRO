const {
  PedidoGuia,
} = require("../../../pedidos_guias/infraestructure/models/pedidoGuiaModel");
const db = require("../../../../database/models");
const {
  Contrato,
} = require("../../../contratos/infraestructure/models/contratoModel");
const sumarPiezas = require("../utils/sumar_piezas");
const restarInventarioYDetectarFaltantes = require("../utils/restarInventarioYDetectarFaltantes");
const clasificar_stock = require("../utils/clasificar_stock");

const determinarEstadoPasePedido = async (lote_piezas, contrato_id) => {
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

  const LOTE_ACTUAL_SUM_LOTES_ENVIADOS = sumarPiezas([
    lote_piezas,
    suma_pedidos_anteriores,
  ]);

  const contrato = await Contrato.findByPk(contrato_id, {
    include: [
      {
        model: db.despieces,
        as: "despiece",
        include: [
          {
            model: db.despieces_detalle,
            attributes: ["pieza_id", "item", "descripcion", "cantidad"],
          },
        ],
      },
    ],
  });
  const DESPIECE_CONTRATO = contrato.get({ plain: true }).despiece
    .despieces_detalles;

  const resta_despieces = restarInventarioYDetectarFaltantes(
    DESPIECE_CONTRATO,
    LOTE_ACTUAL_SUM_LOTES_ENVIADOS
  );

  if (resta_despieces.no_encontradas.length > 0) {
    let descripciones = "";
    for (const p of resta_despieces.no_encontradas) {
      descripciones += " - " + p.descripcion;
    }
    throw new Error(
      `Las siguientes piezas no se encuentran en el despiece del contrato: ${descripciones}`
    );
  }

  const CLASIFICACION_STOCK = clasificar_stock(resta_despieces.resta);
  if (CLASIFICACION_STOCK === "STOCK-EXCEDIDO") {
    throw new Error("Las pieas enviadas exceden el despeice del contrato");
  }
  return CLASIFICACION_STOCK;
};

module.exports = determinarEstadoPasePedido;
