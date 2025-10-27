const { getFechaHoraLima } = require("../../../../shared/utils/fechaLima");
const {
  MovimientoStockPedido,
} = require("../models/movimientoStockPedidoModel");
const { StockPedidoPieza } = require("../models/stockPedidoPiezaModel");

class SequelizeStockPedidoPiezaRepository {
  async crearStockPedidoPieza(payload, transaction = null) {
    //DATOS DEL PAYLOAD: pase_pedido_id y pieza_id
    payload.stock_fijo = 0;
    const stock_pedido_pieza = await StockPedidoPieza.create(payload, {
      transaction,
    });

    return stock_pedido_pieza;
  }
  async obtenerStockPedidoPieza(payload, transaction = null) {
    const stock_pedido_pieza = await StockPedidoPieza.findOne({
      where: {
        pieza_id: payload.pieza_id,
        pase_pedido_id: payload.pase_pedido_id,
      },
      transaction,
    });
    return stock_pedido_pieza;
  }

  async actualizarStockPedidoPieza(
    pieza_id,
    pase_pedido_id,
    tipo_movimiento,
    cantidad,
    transaction = null
  ) {
    const stock_pedido_pieza = await StockPedidoPieza.findOne({
      where: { pieza_id, pase_pedido_id },
      transaction,
    });
    // console.log("Stock Pedido Pieza Pre", stock_pedido_pieza.get({plain:true}));

    const stock_pre_movimiento = stock_pedido_pieza.stock_fijo;
    if (tipo_movimiento === "alquiler") {
      stock_pedido_pieza.stock_fijo += cantidad;
    } else if (
      tipo_movimiento === "devolucion" ||
      tipo_movimiento === "compra"
    ) {
      stock_pedido_pieza.stock_fijo -= cantidad;
    } else {
      throw new Error("Tipo de movimiento inválido");
    }
    await stock_pedido_pieza.save({ transaction });
    const stock_post_movimiento = stock_pedido_pieza.stock_fijo;
    const payload = {
      stock_pedido_pieza_id: stock_pedido_pieza.id,
      tipo: tipo_movimiento,
      cantidad,
      stock_pre_movimiento,
      stock_post_movimiento,
      fecha: getFechaHoraLima(),
    };

    const movimiento_stock_pedido_pieza = await MovimientoStockPedido.create(
      payload,
      { transaction }
    );
    // console.log(
    //   "Movimiento creado en el stock Pedido Pieza: ",
    //   movimiento_stock_pedido_pieza.get({plain:true})
    // );
    // console.log("Stock Pedido Pieza Post", stock_pedido_pieza.get({plain:true}));
  }
}

module.exports = SequelizeStockPedidoPiezaRepository;
