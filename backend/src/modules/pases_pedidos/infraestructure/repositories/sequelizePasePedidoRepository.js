const db = require("../../../../database/models");

const { PasePedido } = require("../models/pasePedidoModel");

class SequelizePasePedidoRepository {
  async crearPasePedido(payload, transaction = null) {
    const buscar_pase = await PasePedido.findOne({
      where: {
        contrato_id: payload.contrato_id,
      },
      transaction,
    });
    if (buscar_pase) {
      throw new Error("Ya existe un pase de pedido con este contrato.");
    }

    const pase_pedido = await PasePedido.create(payload, { transaction });
    return pase_pedido;
  }

  async obtenerPasesPedidos(usuario, transaction = null) {
    const { rol, area, id } = usuario;    
    const roles_almacen = ["Jefa de Almacén", "Auxiliar de oficina"];
    const roles_comerciales = ["Técnico Comercial"];
    let pasePedidoWhere = {};
    let contratoWhere = {};

    if (roles_almacen.includes(rol)) {
      pasePedidoWhere.estado = ["Stock Confirmado", "Incompleto"];
    } else if (roles_comerciales.includes(rol)) {
      contratoWhere.usuario_id = id;
    } else if (area == "Gerencia");
    else {
      throw new Error(
        "Usted no tiene autorización para acceder a esta información"
      );
    }

    const pases_pedidos = await PasePedido.findAll({
      where: pasePedidoWhere,
      transaction,
      include: [
        {
          model: db.stock_pedidos_piezas,
          as: "stock_pedido_pieza",
        },
        {
          model: db.contratos,
          as: "contrato",
          ...(Object.keys(contratoWhere).length > 0 && {
            where: contratoWhere,
            required: true,
          }),
          include: [
            {
              model: db.cotizaciones,
              as: "cotizacion",
              include: [
                {
                  model: db.despieces,
                  include: [
                    {
                      model: db.despieces_detalle,
                    },
                  ],
                },
                {
                  model: db.obras,
                },
                {
                  model: db.clientes,
                },
                {
                  model: db.empresas_proveedoras,
                },
                {
                  model: db.contactos,
                },
                {
                  model: db.usuarios,
                  include: [{ model: db.trabajadores, as: "trabajador" }],
                },
                {
                  model: db.cotizaciones_transporte,
                },
              ],
            },
          ],
        },
      ],
    });
    return pases_pedidos;
  }

  async obtenerPasePedidoPorId(id, transaction = null) {
    const pase_pedido = await PasePedido.findByPk(id, { transaction });
    return pase_pedido;
  }
  async actualizarPasePedido(payload, pedido_id, transaction = null) {
    await PasePedido.update(payload, { where: { id: pedido_id }, transaction });
    // const pase_pedido_actualizado=await PasePedido.findByPk(pedido_id,{transaction});
    // console.log("PASE PEDIDO ACTUALIZADO: ", pase_pedido_actualizado);
  }
  async obtenerPasesPedidoParaTv(transaction = null) {
    const pases_pedidos = await PasePedido.findAll({
      where: { estado: ["Stock Confirmado", "Incompleto"] },
      transaction,
      include: [
        {
          model: db.pedidos_guias,
          as: "pedidos_guias",
          include: [
            {
              model: db.guias_de_remision,
              as: "guia_remision",
            },
          ],
        },
        {
          model: db.contratos,
          as: "contrato",
          include: [
            {
              model: db.clientes,
              as: "cliente",
            },
            {
              model: db.empresas_proveedoras,
              as: "filial",
            },
          ],
        },
      ],
    });
    return pases_pedidos;
  }
}

module.exports = SequelizePasePedidoRepository;
