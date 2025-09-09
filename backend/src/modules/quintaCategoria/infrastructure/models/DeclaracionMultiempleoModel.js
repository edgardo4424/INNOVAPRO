const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const DeclaracionMultiempleoModel = sequelize.define('quinta_multiempleo_declaraciones', {
  id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    primaryKey: true, 
    autoIncrement: true 
  },
  dni: { 
    type: DataTypes.STRING(15), 
    allowNull: false,
  },
  anio: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  filial_principal_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  renta_bruta_otros_anual: { 
    type: DataTypes.DECIMAL(12,2), 
    defaultValue: 0,
    allowNull: false 
  },
  retenciones_previas_otros: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  detalle_json: { 
    type: DataTypes.JSON, 
    allowNull: false 
  },
  aplica_desde_mes: {
    type: DataTypes.TINYINT,
    allowNull: true,
  },
  archivo_url: {
    type: DataTypes.STRING(512),
    allowNull: true
  },
  estado: { 
    type: DataTypes.ENUM('VIGENTE', 'ANULADO'), 
    allowNull: false, 
    defaultValue: 'VIGENTE' 
  },
}, {
  tableName: 'quinta_multiempleo_declaraciones',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['dni', 'anio'], unique: true},
    { fields: ['filial_principal_id'] }
  ]
});

module.exports = DeclaracionMultiempleoModel;