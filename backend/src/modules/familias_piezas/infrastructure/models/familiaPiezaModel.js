const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const FamiliaPieza = sequelize.define(
  "familias_piezas",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: "familias_piezas",
  });

  FamiliaPieza.associate = (models) => {
    FamiliaPieza.hasMany(models.piezas, {
      foreignKey: "familia_id",
  });
}

module.exports = { FamiliaPieza }; // Exporta el modelo para que pueda ser utilizado en otros módulos
