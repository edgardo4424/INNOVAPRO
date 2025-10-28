const sequelize = require("../../config/db");
const emitirGuia = require("../../modules/factiliza/application/emitirGuia");
const SequelizeGuiaRemisionRepository = require("../../modules/facturacion/infrastructure/repositories/sequelizeGuiaRemisionRepository");
const actualizarPasePedido = require("../../modules/pases_pedidos/application/useCases/actualizarPasePedido");
const obtenerPasePedidoPorId = require("../../modules/pases_pedidos/application/useCases/obtenerPasePedidoPorId");
const SequelizePasePedidoRepository = require("../../modules/pases_pedidos/infraestructure/repositories/sequelizePasePedidoRepository");
const determinarEstadoPasePedido = require("../../modules/pases_pedidos/infraestructure/services/determinarEstadoPasePedido");
const actualizarPedidoGuia = require("../../modules/pedidos_guias/application/useCases/actualizarPedidoGuia");
const crearPedidoGuia = require("../../modules/pedidos_guias/application/useCases/crearPedidoGuia");
const SequelizePedidoGuiaRepository = require("../../modules/pedidos_guias/infraestructure/repositories/sequelizePedidoGuiaRepository");
const obtenerPiezaPorItem = require("../../modules/piezas/application/useCases/obtenerPiezaPorItem");
const SequelizePiezaRepository = require("../../modules/piezas/infrastructure/repositories/sequelizePiezaRepository");
const actualizarStockDisponible = require("../../modules/stock/application/usesCases/actualizarStockDisponible");
const actualizarStockFijo = require("../../modules/stock/application/usesCases/actualizarStockFijo");
const {
  MovimientoStock,
} = require("../../modules/stock/infrastructure/models/movimientoStockModel");
const SequelizeStockRepository = require("../../modules/stock/infrastructure/repositories/sequelizeStockRepository");
const actualizarStockPedidoPieza = require("../../modules/stock_pedido_pieza/application/useCases/actualizarStockPedidoPieza");
const crearStockPedidoPieza = require("../../modules/stock_pedido_pieza/application/useCases/crearStockPedidoPieza");
const obtenerStockPedidoPieza = require("../../modules/stock_pedido_pieza/application/useCases/obtenerStockPedidoPieza");
const SequelizeStockPedidoPiezaRepository = require("../../modules/stock_pedido_pieza/infraestructure/repositories/sequelizeStockPedidoPiezaRepository");
const { getFechaHoraLima } = require("../../shared/utils/fechaLima");
const piezaRepository = new SequelizePiezaRepository();
const stockRepository = new SequelizeStockRepository();
const pasePedidoRepository = new SequelizePasePedidoRepository();
const pedidoGuiaRepository = new SequelizePedidoGuiaRepository();
const stockPedidoPiezaRepository = new SequelizeStockPedidoPiezaRepository();
const facturacionRepository = new SequelizeGuiaRemisionRepository();

module.exports = async function registrarTrabajadorConContrato(payload) {
  const t = await sequelize.transaction();

  try {
    const responsePasePedido = await obtenerPasePedidoPorId(
      payload.pedido_id,
      pasePedidoRepository,
      t
    );
    const pase_pedido = responsePasePedido.respuesta.pase_pedido;
    if (
      !pase_pedido ||
      (pase_pedido.estado !== "Stock Confirmado" &&
        pase_pedido.estado !== "Incompleto")
    ) {
      throw new Error("El pase de pedido enviado es incorrecto.");
    }
    const piezas = payload.detalle;
    const piezas_descuento = [];
    const piezas_stock_pedidos = [];
    for (const pieza of piezas) {
      let copy = { ...pieza };
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
      copy.id = pieza_obtenida.respuesta.id;
      pieza.pieza_id=pieza_obtenida.respuesta.id;
      piezas_descuento.push(copy);
      const pieza_pedido = {
        pase_pedido_id: pase_pedido.id,
        pieza_id: pieza_obtenida.respuesta.id,
        cantidad: pieza.cantidad,
      };
      piezas_stock_pedidos.push(pieza_pedido);
    }
    const estado_pase_pedido=await determinarEstadoPasePedido(payload.detalle,pase_pedido.contrato_id);

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
    const payload_pedido_guia = {
      contrato_id: pase_pedido.contrato_id,
      pase_pedido_id: pase_pedido.id,
      fecha_despacho: getFechaHoraLima(),
      estado: "Emitido",
    };
    const response_pedido_guia = await crearPedidoGuia(
      payload_pedido_guia,
      pedidoGuiaRepository,
      t
    );
    const PEDIDO_GUIA = response_pedido_guia.respuesta.pedido_guia;

    if (response_pedido_guia.codigo !== 200) {
      throw new Error(response.respuesta.mensaje);
    }

    if (payload.guia_Envio_Des_Traslado === "ALQUILER") {      
      for (const p of piezas_stock_pedidos) {
      const dataForCreate = {
        pase_pedido_id: pase_pedido.id,
        pieza_id: p.pieza_id,
      };
      const verificar_registro = await obtenerStockPedidoPieza(
        dataForCreate,
        stockPedidoPiezaRepository,
        t
      );

      if (!verificar_registro.respuesta.stock_pedido_pieza) {
        await crearStockPedidoPieza(
          dataForCreate,
          stockPedidoPiezaRepository,
          t
        );
      }

      const dataForUpdate = {
        pieza_id: p.pieza_id,
        pase_pedido_id: pase_pedido.id,
        tipo_movimiento: "alquiler",
        cantidad: p.cantidad,
      };
      const responseUpdateStock = await actualizarStockPedidoPieza(
        dataForUpdate,
        stockPedidoPiezaRepository,
        t
      );
      if (responseUpdateStock.codigo != 201) {
        throw new Error(responseUpdateStock.respuesta.mensaje);
      }
    }
    }

    const guia_remision = await emitirGuia(payload, facturacionRepository);
    if (
      guia_remision.respuesta.status !== 200 &&
      guia_remision.respuesta.status !== 201
    ) {
      await t.rollback();       
      return{
          codigo: 400,
          respuesta: guia_remision.respuesta,
      }
    }
    const payload_pedido_guia_update = {
      guia_remision_id: guia_remision.respuesta.data.guia.id,
    };
    await actualizarPedidoGuia(
      PEDIDO_GUIA.id,
      payload_pedido_guia_update,
      pedidoGuiaRepository,
      t
    );
    console.log("Estado del pase de pediod desde la validadcion",estado_pase_pedido);
    let nuevo_estado_pase_pedido;
    if(estado_pase_pedido=="STOCK-INCOMPLETO")nuevo_estado_pase_pedido="Incompleto";
    if(estado_pase_pedido=="STOCK-COMPLETO")nuevo_estado_pase_pedido="Finalizado";
    if(!nuevo_estado_pase_pedido){
      throw new Error("No se pudo determianr el nuevo estado del pase pedido");
    }

    await actualizarPasePedido({estado:nuevo_estado_pase_pedido},pase_pedido.id,pasePedidoRepository,t);
    await t.commit();
    return {
      codigo: 200,
      respuesta: guia_remision.respuesta,
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
//Crear un registro en la tabla pedidos_guias en estado Emitido(Listo)
//crear los registro en la tabla stock_pedidos_piezas  de cada pieza
//Crear los registro en la tabla movimeinto_stock_pedidos_piezas,
//Crear la guia de remision;
//Obtener el id de la guia de remision creada;
//Actualizar un registro en la tabla pedidos_guias en estado Emitido

//*Nuevas Anotaciones
//Validar que lo enviado en la guia conincida con el depsiece total del contrato
//Con que un pieza falte el pase de pedido no pasara a Finalizado sino a incompleto
