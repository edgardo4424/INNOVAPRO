const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Asistencia = sequelize.define(
   "asistencias",
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      trabajador_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "trabajadores",
            key: "id",
         },
      },
      fecha: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      horas_trabajadas: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
       horas_extras: {
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      estado_asistencia: {
         type: DataTypes.ENUM("presente", "falto", "tardanza","permiso","licencia_sin_goce","licencia_con_goce","vacaciones","falta-justificada"),
         allowNull: false,
      },
   },
   {
      tableName: "asistencias",
      timestamps: false,
   }
);

Asistencia.associate = (models) => {
   Asistencia.hasMany(models.gastos, {
      foreignKey: "asistencia_id",
      as: "gastos",
   });
   Asistencia.hasMany(models.jornadas, {
      foreignKey: "asistencia_id",
      as: "jornadas",
   });

   Asistencia.belongsTo(models.trabajadores, {
      foreignKey: "trabajador_id",
      as: "trabajador",
   });
};
module.exports = { Asistencia };
