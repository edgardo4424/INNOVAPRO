const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const PedidoGuia = sequelize.define(
  "pedidos_guias",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    guia_remision_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "guias_de_remision",
        key: "id",
      },
      defaultValue:null
    },
    contrato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "contratos",
        key: "id",
      },
    },
    pase_pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pases_pedidos",
        key: "id",
      },
    },
    fecha_despacho: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    estado:{
      type:DataTypes.ENUM("Emitido","Despachado"),
      allowNull:false
    }
  },
  {
    tableName: "pedidos_guias",
    timestamps: true,
  }
);

PedidoGuia.associate = (models) => {
  PedidoGuia.belongsTo(models.guias_de_remision, {
    foreignKey: "guia_remision_id",
    as: "guia_remision",
  });

  PedidoGuia.belongsTo(models.contratos, {
    foreignKey: "contrato_id",
    as: "contrato",
  });

  PedidoGuia.belongsTo(models.pases_pedidos, {
    foreignKey: "pase_pedido_id",
    as: "pase_pedido",
  });
};

module.exports = { PedidoGuia };
