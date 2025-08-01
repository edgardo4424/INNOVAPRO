const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const ContratoLaboral = sequelize.define(
   "contratos_laborales",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      trabajador_id: {
         type: DataTypes.INTEGER,
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
      fecha_terminacion_anticipada: {
         type: DataTypes.DATEONLY,
         allowNull: true,
      },
      sueldo: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      regimen: {
         type: DataTypes.ENUM("MYPE", "GENERAL"),
         allowNull: false,
      },
   },
   {
      tableName: "contratos_laborales",
      timestamps: false,
   }
);
ContratoLaboral.associate = (models) => {
   ContratoLaboral.belongsTo(models.trabajadores, {
      foreignKey: "trabajador_id",
      as: "trabajador",
   });
};

module.exports={ContratoLaboral}