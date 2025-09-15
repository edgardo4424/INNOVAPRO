const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const AsistenciaVacaciones = sequelize.define("asistencias_vacaciones", {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
   },
   asistencia_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Se puede mantener en null hasta ser aprobada
      unique: true,
   },
   vacaciones_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
   },
   tipo: {
      type: DataTypes.ENUM("gozada", "vendida"),
      allowNull: false,
   },
});

AsistenciaVacaciones.associate = (models) => {
   AsistenciaVacaciones.belongsTo(models.asistencias, {
      foreignKey: "asistencia_id",
      as: "asistencias",
   });

   AsistenciaVacaciones.belongsTo(models.vacaciones, {
      foreignKey: "vacaciones_id",
      as: "vacaciones",
   });
};

module.exports = { AsistenciaVacaciones };
