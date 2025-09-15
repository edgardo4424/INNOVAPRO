const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Vacaciones = sequelize.define(
   "vacaciones",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      trabajador_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "trabajadores",
            key: "id",
         },
      },
      fecha_inicio: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
      fecha_termino: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
      dias_tomados: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      dias_vendidos: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      observaciones: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      importe_dias_vendidos: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: true,
         defaultValue: 0,
      },
      estado: {
         type: DataTypes.ENUM("pendiente", "aprobada", "rechazada"),
         defaultValue: "pendiente",
         allowNull: false,
      },
   },
   {
      tableName: "vacaciones",
      timestamps: false,
   }
);

Vacaciones.associate = (models) => {
   Vacaciones.belongsTo(models.trabajadores, {
      foreignKey: "trabajador_id",
      as: "trabajadores",
   });
   Vacaciones.hasMany(models.asistencias_vacaciones, {
      foreignKey: 'vacaciones_id',
      as: 'vacaciones_asistencias'
   });
};
module.exports = { Vacaciones };
