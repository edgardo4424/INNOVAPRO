// INNOVA PRO+ v1.1.7 — Modelo de cierres de Quinta
const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const CierreQuintaModel = sequelize.define('CierreQuinta', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  filial_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  periodo: {
    type: DataTypes.STRING(7),
    allowNull: false,
  },
  locked_at: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: DataTypes.NOW 
  },
  usuario_cierre_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
}, {
  tableName: 'cierres_quinta',
  timestamps: true,         
  underscored: false,       
  indexes: [
    { name: 'uq_cierres_quinta_filial_periodo', unique: true, fields: ['filial_id', 'periodo'] },
    { name: 'idx_cierres_quinta_periodo', fields: ['periodo'] },
    { name: 'idx_cierres_quinta_usuario', fields: ['usuario_cierre_id'] },
  ],
});

module.exports = CierreQuintaModel;