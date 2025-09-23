const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const DeclaracionMultiempleoModel = sequelize.define('quinta_multiempleo_declaraciones', {
  id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    autoIncrement: true, 
    primaryKey: true 
  },
  dni: { 
    type: DataTypes.STRING(32), 
    allowNull: false 
  },
  anio: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    allowNull: false 
  },
  aplica_desde_mes: { 
    type: DataTypes.TINYINT.UNSIGNED, 
    allowNull: false 
  },
  filial_principal_id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    allowNull: true 
  },
  es_secundaria: { 
    type: DataTypes.BOOLEAN, allowNull: false, 
    defaultValue: false 
  }, // somos agente secundario?
  principal_ruc: { 
    type: DataTypes.STRING(20), 
    allowNull: true 
  },
  principal_razon_social: { 
    type: DataTypes.STRING(150), 
    allowNull: true 
  },
  renta_bruta_otros_anual:    { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  retenciones_previas_otros:  { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  detalle_json: { 
    type: DataTypes.JSON, 
    allowNull: true 
  },
  observaciones: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  archivo_url: { 
    type: DataTypes.STRING(500), 
    allowNull: true 
  },
  estado: { 
    type: DataTypes.ENUM('VIGENTE','ANULADO'), 
    allowNull: false, 
    defaultValue: 'VIGENTE' 
  },
  es_oficial: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: true 
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