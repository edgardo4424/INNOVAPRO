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
      tipo_contrato: {
         type: DataTypes.ENUM("PLANILLA", "HONORARIOS"),
         allowNull: false,
      },
      estado: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: true, // activo
      },
      filial_id: {
         type: DataTypes.INTEGER,
         allowNull: true,
         references: {
            model: "empresas_proveedoras",
            key: "id",
         },
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
   ContratoLaboral.belongsTo(models.empresas_proveedoras, {
      foreignKey: "filial_id",
      as: "empresa_proveedora",
   });
};

module.exports = { ContratoLaboral };
