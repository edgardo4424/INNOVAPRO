const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Trabajador = sequelize.define(
   "trabajadores",
   {
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
      sueldo_base: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      asignacion_familiar: {
         type: DataTypes.DATEONLY,
         allowNull: true,
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
      domiciliado: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: false,
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
   Trabajador.hasMany(models.contratos_laborales, {
      foreignKey: "trabajador_id",
      as: "contratos_laborales",
   });
   Trabajador.hasMany(models.vacaciones, {
      foreignKey: "trabajador_id",
      as: "vacaciones",
   });
   Trabajador.hasMany(models.bonos, {
      foreignKey: "trabajador_id",
      as: "bonos",
   });
   Trabajador.hasMany(models.adelanto_sueldo, {
      foreignKey: "trabajador_id",
      as: "adelanto_sueldo",
   });
   Trabajador.belongsTo(models.cargos, {
      foreignKey: "cargo_id",
      as: "cargo",
   });
};
module.exports = { Trabajador };
