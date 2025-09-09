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
  }, // 1-12
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
  observaciones: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  archivo_url: { 
    type: DataTypes.STRING(500), 
    allowNull: true 
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