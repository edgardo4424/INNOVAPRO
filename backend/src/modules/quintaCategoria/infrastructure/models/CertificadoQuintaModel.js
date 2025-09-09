const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const CertificadoQuintaModel = sequelize.define('quinta_certificados_externos', {
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
  empresa_ruc: { 
    type: DataTypes.STRING(20), 
    allowNull: true 
  },
  empresa_razon_social: { 
    type: DataTypes.STRING(150), 
    allowNull: true 
  },
  renta_bruta_total: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: true, 
    defaultValue: 0 
  },
  remuneraciones: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: true, 
    defaultValue: 0 
  },
  gratificaciones: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: true, 
    defaultValue: 0 
  },
  otros: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: true, 
    defaultValue: 0 
  },
  asignacion_familiar: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: true, 
    defaultValue: 0 
  },
  retenciones_previas: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: true, 
    defaultValue: 0 
  },
  fecha_emision: { 
    type: DataTypes.DATEONLY, 
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
  tableName: 'quinta_certificados_externos',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['dni', 'anio'], unique: true}
  ]
});

module.exports = CertificadoQuintaModel;