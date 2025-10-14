const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const DeclaracionSinPreviosModel = sequelize.define('quinta_declaracion_sin_previos', {
  id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    autoIncrement: true, 
    primaryKey: true 
  },
  dni: { 
    type: DataTypes.STRING(15), 
    allowNull: false 
  },
  anio: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },

  fecha_declaracion: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: DataTypes.NOW 
  },
  aplica_desde_mes: {
    type: DataTypes.TINYINT,
    allowNull: true,
  },
  archivo_url: { 
    type: DataTypes.STRING(512), 
    allowNull: true 
  },
  observaciones: { 
    type: DataTypes.STRING(1000), 
    allowNull: true 
  },

  estado: { 
    type: DataTypes.ENUM('VIGENTE','ANULADO'), 
    defaultValue: 'VIGENTE' 
  }
}, {
  tableName: 'quinta_declaracion_sin_previos',
  underscored: true,
  timestamps: true,
  indexes: [
    { fields: ['dni','anio'], unique: true }
  ]
});

module.exports = DeclaracionSinPreviosModel;