const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Area = sequelize.define(
   "areas",
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      nombre: {
         type: DataTypes.STRING,
         allowNull: false,
      },
   },
   {
      tableName: "areas",
      timestamps: false,
   }
);

Area.associate = (models) => {
   Area.hasMany(models.cargos, {
      foreignKey: "area_id",
      as: "cargos",
   });
};

module.exports = {
   Area,
};
