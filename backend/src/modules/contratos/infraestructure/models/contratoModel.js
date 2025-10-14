const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Contrato = sequelize.define(
   "contratos",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
         unique: true,
      },
      cotizacion_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         unique:true,
         references:{
            model:"cotizaciones",
            key:"id"
         }
      },
      notas_legales: {
         type: DataTypes.JSON,
         allowNull: true,
      },
   },
   {
      tableName: "contratos",
      timestamps: true,
   }
);

Contrato.associate = (models) => {
   Contrato.hasOne(models.pases_pedidos, {
      foreignKey: "contrato_id",
      as: "pase_pedido",
   });
   Contrato.belongsTo(models.cotizaciones,{
        foreignKey:"cotizacion_id",
        as:"cotizacion"
   })
};

module.exports = { Contrato };
