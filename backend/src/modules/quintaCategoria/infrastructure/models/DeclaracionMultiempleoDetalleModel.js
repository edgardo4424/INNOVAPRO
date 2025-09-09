const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const DeclaracionMultiempleoDetalleModel = sequelize.define("quinta_multiempleo_detalles", {
  id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    autoIncrement: true, 
    primaryKey: true 
  },
  multiempleo_id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    allowNull: false 
  },
  tipo: { 
    type: DataTypes.ENUM("FILIAL","EXTERNO"), 
    allowNull: false 
  },
  filial_id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    allowNull: true 
  },
  empleador_ruc: { 
    type: DataTypes.STRING(20), 
    allowNull: true 
  },
  empleador_razon_social: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  renta_bruta_anual: { 
    type: DataTypes.DECIMAL(12,2), 
    defaultValue: 0 
  },
  retenciones_previas: { 
    type: DataTypes.DECIMAL(12,2), 
    defaultValue: 0 
  },
  detalle_json: { 
    type: DataTypes.JSON, 
    allowNull: true 
  },
  estado: { 
    type: DataTypes.ENUM("VIGENTE","ANULADO"), 
    defaultValue: "VIGENTE" 
}
},{
  tableName: "quinta_multiempleo_detalles",
  underscored: true,
  timestamps: true
});

module.exports = DeclaracionMultiempleoDetalleModel;
