const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Pieza = sequelize.define(
  "piezas",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    familia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "familias_piezas", key: "id" },
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    peso_kg: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    precio_venta_dolares: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    precio_venta_soles: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    precio_alquiler_soles: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    stock_actual: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    tableName: "piezas",
  }
);

Pieza.associate = (models) => {
  Pieza.belongsTo(models.familias_piezas, {
    foreignKey: "familia_id",
    as: "familia",
  });
  Pieza.hasMany(models.piezas_usos, {
    foreignKey: "pieza_id",
  });
  Pieza.hasOne(models.stock,{
    foreignKey:"pieza_id",
    as:"stock"
  })
};

module.exports = { Pieza }; // Exporta el modelo para que pueda ser utilizado en otros módulos
