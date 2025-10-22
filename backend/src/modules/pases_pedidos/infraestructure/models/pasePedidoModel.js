const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const PasePedido = sequelize.define(
  "pases_pedidos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    contrato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "contratos",
        key: "id",
      },
    },
    fecha_emision: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(
        "Por confirmar",
        "Pre confirmado",
        "Confirmado",
        "Stock Confirmado",
        "En despacho",
        "Despachado"
      ),
      allowNull: false,
      defaultValue: "pendiente",
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "pases_pedidos",
    timestamps: true,
  }
);

PasePedido.associate = (models) => {
  PasePedido.belongsTo(models.contratos, {
    foreignKey: "contrato_id",
    as: "contrato",
  });
  PasePedido.hasOne(models.stock_pedidos_piezas, {
    foreignKey: "pase_pedido_id",
    as: "stock_pedido_pieza",
  });
};

module.exports = { PasePedido };
