const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const CotizacionesTransporte = sequelize.define(
  "cotizaciones_transporte",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cotizacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    distrito_transporte_id: {
      type: DataTypes.INTEGER,
    },
    tarifa_transporte_id: {
      type: DataTypes.INTEGER,
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
     cantidad: { // cantidad medida en la unidad indicada
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    costo_tarifas_transporte: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    costo_pernocte_transporte: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    costo_distrito_transporte: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
     costo_total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
  }, {
    timestamps: false,
    tableName: "cotizaciones_transporte",
  });

CotizacionesTransporte.associate = (models) => {

  CotizacionesTransporte.belongsTo(models.cotizaciones, {
    foreignKey: "cotizacion_id",
    as: "cotizacion",
  });

  CotizacionesTransporte.belongsTo(models.tarifas_transporte, {
    foreignKey: "tarifa_transporte_id",
    as: "tarifa_transporte",
  });

  CotizacionesTransporte.belongsTo(models.usos, {
    foreignKey: "uso_id",
    as: "uso",
  });

  CotizacionesTransporte.belongsTo(models.distritos_transporte, {
    foreignKey: "distrito_transporte_id",
    as: "distrito_transporte",
  });

}


module.exports = { CotizacionesTransporte }; // Exporta el modelo para que pueda ser utilizado en otros módulos
