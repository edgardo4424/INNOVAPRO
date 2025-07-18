const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const TarifasTransporte = sequelize.define(
  "tarifas_transporte",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    grupo_tarifa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo_transporte: {
      type: DataTypes.ENUM(
        "Camioneta",
        "Camión",
      ),
      allowNull: false,
    },
    unidad: {
      type: DataTypes.ENUM(
        "Tn",
        "Tramo",
        "Andamio",
        "Pd",
        "Und"
      ),
      allowNull: false,
    },
    rango_desde: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    rango_hasta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precio_soles: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: "tarifas_transporte",
  });

TarifasTransporte.associate = (models) => {
   TarifasTransporte.hasMany(models.cotizaciones_transporte,{
     foreignKey: "tarifa_transporte_id",
  })
}


module.exports = { TarifasTransporte }; // Exporta el modelo para que pueda ser utilizado en otros módulos
