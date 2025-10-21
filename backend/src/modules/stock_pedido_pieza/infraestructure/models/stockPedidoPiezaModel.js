const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const StockPedidoPieza = sequelize.define(
  "stock_pedidos_piezas",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pase_pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pases_pedidos",
        key: "id",
      },
    },
    pieza_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "piezas",
        key: "id",
      },
    },
    stock_fijo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stock_disponible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "stock_pedidos_piezas",
    timestamps: true,
  }
);

StockPedidoPieza.associate = (models) => {
  StockPedidoPieza.belongsTo(models.pases_pedidos, {
    foreignKey: "pase_pedido_id",
    as: "pase_pedido",
  });

  StockPedidoPieza.belongsTo(models.piezas, {
    foreignKey: "pieza_id",
    as: "pieza",
  });

  StockPedidoPieza.hasMany(models.movimientos_stock_pedido, {
    foreignKey: "stock_pedido_pieza_id",
    as: "movimientos",
  });
};

module.exports = { StockPedidoPieza };
