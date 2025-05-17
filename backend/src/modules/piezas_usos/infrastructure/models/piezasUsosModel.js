const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const PiezasUsos = sequelize.define(
  "piezas_usos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pieza_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "piezas", key: "id" },
    },
    uso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "usos", key: "id" },
    },
   
  }, {
    timestamps: false,
    tableName: "piezas_usos",
  });

  PiezasUsos.associate = (models) => {
    PiezasUsos.belongsTo(models.piezas, {
      foreignKey: "pieza_id",
      as: "pieza",
    });

    PiezasUsos.belongsTo(models.usos, {
      foreignKey: "uso_id",
      as: "uso",
    });
}

module.exports = { PiezasUsos }; // Exporta el modelo para que pueda ser utilizado en otros módulos
