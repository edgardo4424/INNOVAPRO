const { DataTypes, INTEGER, STRING, BOOLEAN } = require("sequelize");
const sequelize = require("../../../../config/db");

const Trabajador = sequelize.define(
   "trabajadores",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      filial_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "empresas_proveedoras",
            key: "id",
         },
      },
      cargo_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "cargos",
            key: "id",
         },
      },
      nombres: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      apellidos: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      tipo_documento: {
         type: DataTypes.ENUM("DNI", "CE", "PTP"),
         allowNull: false,
      },
      numero_documento: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      fecha_ingreso: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      fecha_salida: {
         type: DataTypes.DATE,
         allowNull: true,
      },
      sueldo_base: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      asignacion_familiar: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
      },
      sistema_pension: {
         type: DataTypes.ENUM("AFP", "ONP"),
         allowNull: false,
      },
      quinta_categoria: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
      },
      estado: {
         type: DataTypes.ENUM("activo", "inactivo"),
         allowNull: false,
         defaultValue: "activo",
      },
   },
   {
      tableName: "trabajadores",
      timestamps: false,
   }
);

Trabajador.associate = (models) => {
   Trabajador.hasMany(models.asistencias, {
      foreignKey: "trabajador_id",
      as: "asistencias",
   });

   Trabajador.belongsTo(models.empresas_proveedoras, {
      foreignKey: "filial_id",
      as: "empresa_proveedora",
   });
   Trabajador.belongsTo(models.cargos, {
      foreignKey: "cargo_id",
      as: "cargo",
   });
};
module.exports = { Trabajador };
