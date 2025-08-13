const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Bonos = sequelize.define(
   "bonos",
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
      fecha: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
      monto: {
         type: DataTypes.FLOAT,
         allowNull: false,
      },
      observacion: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      estado: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: true, // activo
      },
   },
   {
      tableName: "bonos",
      timestamps: false,
   }
);

Bonos.associate = (models) => {
   Bonos.belongsTo(models.trabajadores, {
      foreignKey: "trabajador_id",
      as: "trabajadores",
   });
};

module.exports = { Bonos };
