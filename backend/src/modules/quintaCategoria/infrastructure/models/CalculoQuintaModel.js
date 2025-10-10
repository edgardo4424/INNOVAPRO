// INNOVA PRO+ v1.3.0 - Modelo alineado a 20251009-crear-quinta_calculos-v2.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/db');

const CalculoQuintaModel = sequelize.define('CalculoQuinta', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },

  // Identificadores
  trabajador_id:        { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  contrato_id:          { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  filial_actual_id:     { type: DataTypes.INTEGER, allowNull: true }, // renombrado desde filial_id
  es_secundaria:        { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  filial_retenedora_id: { type: DataTypes.INTEGER, allowNull: true },

  // Claves de cálculo
  dni:  { type: DataTypes.STRING(15), allowNull: false },
  anio: { type: DataTypes.INTEGER, allowNull: false },
  mes:  { type: DataTypes.INTEGER, allowNull: false },

  // Parámetros tributarios
  uit_valor:          { type: DataTypes.DECIMAL(10,2), allowNull: false },
  deduccion_fija_uit: { type: DataTypes.DECIMAL(6,2), allowNull: false },
  divisor_calculo:{ type: DataTypes.INTEGER, allowNull: false },

  // Auditoría
  creado_por:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  es_recalculo: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },

  // Soportes (FKs se agregarán en migraciones futuras)
  soporte_multi_interno_id: { type: DataTypes.INTEGER, allowNull: true },
  soporte_multiempleo_id:   { type: DataTypes.INTEGER, allowNull: true },
  soporte_certificado_id:   { type: DataTypes.INTEGER, allowNull: true },
  soporte_sin_previos_id:   { type: DataTypes.INTEGER, allowNull: true },

  // Fuente de previos
  fuente_previos: {
    type: DataTypes.ENUM('AUTO', 'CERTIFICADO', 'SIN_PREVIOS'),
    allowNull: false,
    defaultValue: 'AUTO',
  },

  // Previos
  ingresos_previos_internos:           { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  ingresos_previos_externos:           { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  ingresos_previos_acum_filial_actual: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },

  // Entradas actuales
  remuneracion_mensual_filial_actual: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  bonos:                 { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  asignacion_familiar:   { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },

  // Pagos reales ya efectuados (histórico del año)
  grati_julio_pagada:            { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  grati_diciembre_pagada:        { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  grati_pagadas_otras:           { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  asignacion_familiar_total_otras:{ type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },

  // Proyecciones del año
  grati_julio_proj:         { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  grati_diciembre_proj:     { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  otros_ingresos_proj:      { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  asignacion_familiar_proj: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },

  // Otras filiales (multi interno)
  remu_proj_total_otras:          { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  grati_proj_total_otras:         { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  asignacion_familiar_proj_otras: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },

  // Retenciones previas
  origen_retencion: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "NINGUNO" },
  retenciones_previas_internas:      { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
  retenciones_previas_externas:      { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
  retenciones_previas_filial_actual: { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },

  // Mes en curso / ajustes
  extra_gravado_mes:       { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  retencion_adicional_mes: { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },

  // Resultados y snapshot de tramos
  bruto_anual_proyectado: { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
  renta_neta_anual:       { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
  tramos_usados_json:     { type: DataTypes.JSON, allowNull: false },

  impuesto_anual:     { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
  retencion_base_mes: { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
}, {
  tableName: 'quinta_calculos',
  timestamps: true,          // mapea a created_at / updated_at por underscored
  underscored: true,
});

module.exports = CalculoQuintaModel;