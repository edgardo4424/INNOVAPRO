const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Gasto = sequelize.define(
   "gastos",
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
      descripcion: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      monto: {
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
   },
   {
      tableName: "gastos",
      timestamps: false,
   }
);

Gasto.associate = (models) => {
   Gasto.belongsTo(models.asistencias, {
      foreignKey: "asistencia_id",
      as: "asistencia",
   });
};
module.exports = { Gasto };
