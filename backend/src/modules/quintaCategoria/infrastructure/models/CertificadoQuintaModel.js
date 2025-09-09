const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const CertificadoQuintaModel = sequelize.define('quinta_certificados_externos', {
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
  renta_bruta_total: { 
    type: DataTypes.DECIMAL(12,2), 
    defaultValue: 0
  },
  retenciones_previas: { 
    type: DataTypes.DECIMAL(12,2), 
    defaultValue: 0 
  },
  // opcional: para guardar desgloce si lo obtenemos (remuneraciones, grati, otros, Asignacion Familiar)
  detalle_json: { 
    type: DataTypes.JSON, 
    allowNull: false 
  },
  aplica_desde_mes: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  // metadatos
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
  tableName: 'quinta_certificados_externos',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['dni', 'anio'], unique: true}
  ]
});

module.exports = CertificadoQuintaModel;