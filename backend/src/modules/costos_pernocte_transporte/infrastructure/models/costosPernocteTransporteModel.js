const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const CostosPernocteTransporte = sequelize.define(
  "costos_pernocte_transporte",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo_transporte: {
      type: DataTypes.ENUM(
        "Camioneta",
        "Camión",
      ),
      allowNull: false,
    },
    precio_soles: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    umbral_toneladas: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: "costos_pernocte_transporte",
  });


module.exports = { CostosPernocteTransporte }; // Exporta el modelo para que pueda ser utilizado en otros módulos
