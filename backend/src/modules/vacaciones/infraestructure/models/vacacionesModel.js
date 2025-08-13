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
         type: DataTypes.DATE,
         allowNull: false,
      },
      fecha_termino: {
         type: DataTypes.DATE,
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
};
module.exports = { Vacaciones };
