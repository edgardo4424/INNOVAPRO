const { DataTypes, INTEGER, STRING, BOOLEAN } = require("sequelize");
const sequelize = require("../../../../config/db");

const Cargo = sequelize.define(
   "cargos",
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
        area_id: {
           type: DataTypes.INTEGER,
           allowNull: false,
           references: {
              model: "areas",
              key: "id",
           },
        },
      nombre: {
         type: DataTypes.STRING,
         allowNull: false,
      },
   },
   {
      tableName: "cargos",
      timestamps: false,
   }
);

Cargo.associate = (models) => {
      Cargo.belongsTo(models.areas, {
         foreignKey: "area_id",
         as: "area",
      });
   Cargo.hasMany(models.trabajadores, {
      foreignKey: "cargo_id",
      as: "trabajadores",
   });
};
module.exports = { Cargo };
