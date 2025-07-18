const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); 

const CotizacionesInstalacion = sequelize.define(
  "cotizaciones_instalacion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cotizacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // ⚠️ Esto garantiza la relación 1:1
      references: {
        model: "cotizaciones",
        key: "id",
      },
    },
    tipo_instalacion: {
      type: DataTypes.ENUM(
        "Parcial", 
        "Completa",
      ),
      allowNull: false,
    },
    precio_instalacion_completa_soles: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    precio_instalacion_parcial_soles: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    nota: {
        type: DataTypes.TEXT
    }

  }, 
  {
    timestamps: false,
    tableName: "cotizaciones_instalacion",
  });

  CotizacionesInstalacion.associate = (models) => {
    CotizacionesInstalacion.belongsTo(models.cotizaciones, {
      foreignKey: "cotizacion_id",
  });

}

module.exports = { CotizacionesInstalacion }; 