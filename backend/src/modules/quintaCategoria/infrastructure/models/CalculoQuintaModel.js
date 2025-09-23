const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const CalculoQuintaModel = sequelize.define('CalculoQuinta', {
  id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    primaryKey: true, 
    autoIncrement: true 
  },
  trabajador_id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    allowNull: true 
  },
  contrato_id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    allowNull: true 
  },
  filial_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dni: { 
    type: DataTypes.STRING(15), 
    allowNull: false,
  },
  anio: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  mes: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  remuneracion_mensual: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false 
  },
  ingresos_previos_acum: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  grati_julio_proj: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  grati_diciembre_proj: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  otros_ingresos_proj: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  bruto_anual_proyectado: { 
    type: DataTypes.DECIMAL(14,2), 
    allowNull: false 
  },
  renta_neta_anual: { 
    type: DataTypes.DECIMAL(14,2), 
    allowNull: false 
  },
  impuesto_anual: { 
    type: DataTypes.DECIMAL(14,2), 
    allowNull: false 
  },
  retenciones_previas: { 
    type: DataTypes.DECIMAL(14,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  divisor_calculo: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  retencion_base_mes: { 
    type: DataTypes.DECIMAL(14,2), 
    allowNull: false 
  },
  extra_gravado_mes: { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  }, // grati/utilidades/bono gravado
  retencion_adicional_mes: { 
    type: DataTypes.DECIMAL(14,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  uit_valor: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false 
  },
  deduccion_fija_uit: { 
    type: DataTypes.DECIMAL(6,2),  
    allowNull: false 
  },
  tramos_usados_json: { 
    type: DataTypes.JSON, 
    allowNull: false 
  },
  fuente: { 
    type: DataTypes.ENUM('informativo', 'oficial'), 
    allowNull: false, 
    defaultValue: 'informativo' 
  },
  es_recalculo: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false 
  },
  creado_por: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    allowNull: true 
  },
  filial_retiene_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  origen_retencion: { 
    type: DataTypes.STRING(32), 
    allowNull: false, 
    defaultValue: "NINGUNO" 
  },
  es_secundaria:   { 
    type: DataTypes.BOOLEAN, 
    allowNull: false, 
    defaultValue: false 
  }, // mapea a TINYINT
  ingresos_previos_internos:  { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  ingresos_previos_externos:  { 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  retenciones_previas_externas:{ 
    type: DataTypes.DECIMAL(12,2), 
    allowNull: false, 
    defaultValue: 0 
  },
  soporte_multiempleo_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  soporte_certificado_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  soporte_sin_previos_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  soportes_json: { 
    type: DataTypes.JSON, 
    allowNull: true 
  },
}, {
  tableName: 'quinta_calculos',
  timestamps: true,
  underscored: true
});
module.exports = CalculoQuintaModel;