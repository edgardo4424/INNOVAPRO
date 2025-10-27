const sequelize = require("../../config/db");
const obtenerPasePedidoPorId = require("../../modules/pases_pedidos/application/useCases/obtenerPasePedidoPorId");
const SequelizePasePedidoRepository = require("../../modules/pases_pedidos/infraestructure/repositories/sequelizePasePedidoRepository");
const obtenerPiezaPorItem = require("../../modules/piezas/application/useCases/obtenerPiezaPorItem");
const SequelizePiezaRepository = require("../../modules/piezas/infrastructure/repositories/sequelizePiezaRepository");
const actualizarStockDisponible = require("../../modules/stock/application/usesCases/actualizarStockDisponible");
const actualizarStockFijo = require("../../modules/stock/application/usesCases/actualizarStockFijo");
const {
  MovimientoStock,
} = require("../../modules/stock/infrastructure/models/movimientoStockModel");
const SequelizeStockRepository = require("../../modules/stock/infrastructure/repositories/sequelizeStockRepository");
const piezaRepository = new SequelizePiezaRepository();
const stockRepository = new SequelizeStockRepository();
const pasePedidoRepository = new SequelizePasePedidoRepository();
module.exports = async function registrarTrabajadorConContrato(payload) {
  const t = await sequelize.transaction();

  try {
    const responsePasePedido = await obtenerPasePedidoPorId(
      payload.pedido_id,
      pasePedidoRepository,
      t
    );
    const pase_pedido=responsePasePedido.respuesta.pase_pedido;
    if (!pase_pedido||(pase_pedido.estado!=="Stock Confirmado"&&pase_pedido.estado!=="Incompleto")) {
      throw new Error("El pase de pedido enviado es incorrecto.");
    }
    const piezas = payload.detalle;
    const piezas_descuento = [];
    for (const pieza of piezas) {
      const pieza_obtenida = await obtenerPiezaPorItem(
        pieza.cod_Producto,
        piezaRepository,
        t
      );
      if (pieza_obtenida.codigo !== 200) {
        throw new Error(
          `La pieza ${pieza.descripcion} no existe en el sistema`
        );
      }
      pieza.id = pieza_obtenida.respuesta.id;
      piezas_descuento.push(pieza);
    }
    //* DESCUENTO DEL STOCK DE CADA PIEZA

    if (payload.guia_Envio_Des_Traslado === "VENTA") {
      for (const p of piezas_descuento) {
        const payload = {
          piezaId: p.id,
          cantidad: p.cantidad,
          tipoMovimiento: "Venta",
          motivo: `Venta de la pieza ${p.descripcion}`,
        };
        const response = await actualizarStockFijo(payload, stockRepository, t);
        if (response.codigo !== 201) {
          throw new Error(response.respuesta.mensaje);
        }
      }
    }
    if (payload.guia_Envio_Des_Traslado === "ALQUILER") {
      for (const p of piezas_descuento) {
        const payload = {
          piezaId: p.id,
          cantidad: p.cantidad,
          tipoMovimiento: "Alquiler",
          motivo: `Aquiler de la pieza ${p.descripcion}`,
        };
        const response = await actualizarStockDisponible(
          payload,
          stockRepository,
          t
        );
        if (response.codigo !== 201) {
          throw new Error(response.respuesta.mensaje);
        }
      }
    }

    asdsa;
    return {
      codigo: 200,
      respuesta: {
        mensaje: "Envio del pedido creado exitosamnete",
      },
    };
  } catch (error) {
    console.log("error inesperado", error);
    await t.rollback();
    return {
      codigo: 500,
      respuesta: {
        mensaje: "Error inesperado: " + error.message,
      },
    };
  }
};

//todo: Pasos a seguir cuando se crea la primer guia de remisiona de un contrato,
//Verficar que el pase de pedido exista y su estado se emcuentre en stock confirmado o incompleto(LISTO)
//Obtener las piezas de la guia de remision a crear (LISTO),
//Verificar que cada pieza enviada exista en la tablla pieza, Listo
//Realizar el descuento en la tabla stock ("Stock general de innova ")(LISTO)
//Crear un registro en la tabla pedidos_guias en estado Emitido
//crear los registro en la tabla stock_pedidos_piezas  de cada pieza
//Crear los registro en la tabla movimeinto_stock_pedidos_piezas,
//Crear la guia de remision;
//Obtener el id de la guia de remision creada;
//Actualizar un registro en la tabla pedidos_guias en estado Emitido

//*Nuevas Anotaciones
//Validar que lo enviado en la guia conincida con el depsiece total del contrato
//Con que un pieza falte el pase de pedido no pasara a Finalizado sino a incompleto

