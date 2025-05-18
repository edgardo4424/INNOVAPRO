const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const DistritosTransporte = sequelize.define(
  "distritos_transporte",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    extra_camioneta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    extra_camion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: "distritos_transporte",
  });

  DistritosTransporte.associate = (models) => {
   DistritosTransporte.hasMany(models.cotizaciones_transporte,{
     foreignKey: "distrito_transporte_id",
  })
}

module.exports = { DistritosTransporte }; // Exporta el modelo para que pueda ser utilizado en otros módulos
