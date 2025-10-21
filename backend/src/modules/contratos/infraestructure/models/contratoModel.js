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
      ref_contrato: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      fecha_inicio: {
         type: DataTypes.DATEONLY,
         allowNull: false, 
      },
      fecha_fin: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
      clausulas_adicionales: {
         type: DataTypes.JSON,
         allowNull: true,
      },
      requiere_valo_adelantada: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      },
      renovaciones: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      estado: {
         type: DataTypes.ENUM(
            'PROGRAMADO',
            'VIGENTE',
            'POR VENCER',
            'VENCIDO',
            'FIRMADO'
         ),
         allowNull: false,
         defaultValue: 'PROGRAMADO',
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
