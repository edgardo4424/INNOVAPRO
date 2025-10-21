const db = require("../../../../database/models");

const { PasePedido } = require("../models/pasePedidoModel");

class SequelizePasePedidoRepository {
  async crearPasePedido(payload, transaction = null) {
    const pase_pedido = await PasePedido.create(payload, { transaction });
    return pase_pedido;
  }

  async obtenerPasesPedidosConfirmados(transaction = null) {
    const pases_pedidos = await PasePedido.findAll({
      where: { estado: "Confirmado" },
      transaction,
      include: [
        {
          model: db.stock_pedidos_piezas,
          as: "stock_pedido_pieza",
        },
        {
            model:db.contratos,
            as:"contrato",
            include:[
              {
                model:db.cotizaciones,
                as:"cotizacion",
                include:[
                  {
                  model:db.despieces,
                  include:[
                    {
                      model:db.despieces_detalle,
                    }
                  ]
                  },
                  {
                    model:db.obras,
                
                  },
                  {
                    model:db.clientes
                  },
                  {
                    model:db.empresas_proveedoras
                  }
                ]
              }
            ]
        }

      ],
    });
    return pases_pedidos;
  }
}

module.exports = SequelizePasePedidoRepository;
