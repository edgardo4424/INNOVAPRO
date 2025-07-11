const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Jornada = sequelize.define(
   "jornadas",
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      asistencia_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "asistencias",
            key: "id",
         },
      },
      tipo_trabajo_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "tipos_trabajo",
            key: "id",
         },
      },
      turno: {
         type: DataTypes.ENUM("mañana", "tarde"),
         allowNull: false,
      },
      lugar: {
         type: DataTypes.ENUM("almacen", "obra"),
         allowNull: false,
      },
   },
   {
      tableName: "jornadas",
      timestamps: false,
   }
);

Jornada.associate = (models) => {
   Jornada.belongsTo(models.asistencias, {
      foreignKey: "asistencia_id",
      as: "asistencia",
   });
   Jornada.belongsTo(models.tipos_trabajo, {
      foreignKey: "tipo_trabajo_id",
      as: "tipo_trabajo",
   });
};
module.exports = { Jornada };
