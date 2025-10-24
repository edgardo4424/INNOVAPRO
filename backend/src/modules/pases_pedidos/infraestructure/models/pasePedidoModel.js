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
    tarea_id:{
      type:DataTypes.INTEGER,
      allowNull:true,
      defaultValue:null,
      references:{
        model:"tareas",
        key:"id",
      }
    },
    fecha_emision: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(
        "Por confirmar",
        "Pre confirmado",
        "Confirmado",
        "Rechazado",
        "Stock Confirmado",
        "Incompleto",
        "Finalizado"
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
  PasePedido.belongsTo(models.tareas, {
    foreignKey: "tarea_id",
    as: "tarea",
  });
  PasePedido.hasOne(models.stock_pedidos_piezas, {
    foreignKey: "pase_pedido_id",
    as: "stock_pedido_pieza",
  });
};

module.exports = { PasePedido };
