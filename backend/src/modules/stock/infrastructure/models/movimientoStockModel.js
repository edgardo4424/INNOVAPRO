const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const MovimientoStock = sequelize.define(
   "movimiento_stock",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
         unique: true,
      },
      stock_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "stock",
            key: "id",
         },
      },
      tipo: {
         type: DataTypes.ENUM(
            "Alquiler",
            "Devolucion",
            "Ajuste ingreso",
            "Ajuste salida",
            "Ingreso",
            "Baja",
            "Venta",
            "Ingreso-reparacion",
            "Salida-reparacion"
         ),
         allowNull: false,
      },
      cantidad: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      stock_pre_movimiento: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      stock_post_movimiento: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      tipo_stock: {
         type: DataTypes.ENUM("Disponible", "Fijo"),
         allowNull: false,
      },
      motivo: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      fecha: {
         type: DataTypes.DATE,
         allowNull: false,
         defaultValue: DataTypes.NOW,
      },
   },
   {
      tableName: "movimiento_stock",
      timestamps: false,
   }
);

MovimientoStock.associate = (models) => {
   MovimientoStock.belongsTo(models.stock, {
      foreignKey: "stock_id",
      as: "stock",
   });
};

module.exports = { MovimientoStock };
