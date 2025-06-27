const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Stock = sequelize.define(
   "stock",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
         unique: true,
      },
      pieza_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         unique: true,
         references: {
            model: "piezas",
            key: "id",
         },
      },
      stock_fijo: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      stock_disponible: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   },
   {
      tableName: "stock",
      timestamps: false,
   }
);

Stock.associate = (models) => {
   Stock.belongsTo(models.piezas, {
      foreignKey: "pieza_id",
      as: "pieza",
   });

   Stock.hasMany(models.movimiento_stock, {
      foreignKey: "stock_id",
      as: "movimientos",
   });
};

module.exports = { Stock };
