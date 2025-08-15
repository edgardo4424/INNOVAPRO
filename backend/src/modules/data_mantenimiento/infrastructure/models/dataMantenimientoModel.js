const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const DataMantenimiento = sequelize.define(
  "data_mantenimiento",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    actualizado_por: {
        type: DataTypes.INTEGER,
    }
  },
  {
    timestamps: true,
    tableName: "data_mantenimiento",
  }
);

module.exports = { DataMantenimiento }; // Exporta el modelo para que pueda ser utilizado en otros módulos
