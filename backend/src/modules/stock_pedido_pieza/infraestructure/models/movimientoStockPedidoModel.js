const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const MovimientoStockPedido = sequelize.define(
  "movimientos_stock_pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    stock_pedido_pieza_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "stock_pedidos_piezas",
        key: "id",
      },
    },
    tipo: {
      type: DataTypes.ENUM("alquiler", "devolucion", "compra"),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock_pre_movimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock_post_movimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "movimientos_stock_pedido",
    timestamps: true,
  }
);

MovimientoStockPedido.associate = (models) => {
  MovimientoStockPedido.belongsTo(models.stock_pedidos_piezas, {
    foreignKey: "stock_pedido_pieza_id",
    as: "stock_pedido_pieza",
  });
};

module.exports = { MovimientoStockPedido };
