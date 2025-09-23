// INNOVA PRO+ v1.1.0
"use strict";

/**
 * Nuevos campos para registrar:
 * - filial_retiene_id: filial que realiza la retención (cuando aplique)
 * - origen_retencion: 'DJ_MULTIEMPLEO' | 'INFERENCIA_CONTRATOS' | 'SIN_PREVIOS' | 'CERTIFICADO' | 'MIXTO' | 'NINGUNO'
 * - es_secundaria: si esta filial es secundaria y por ende NO retiene
 * - ingresos_previos_internos: suma por otras filiales de Innova (enero..mes-1)
 * - ingresos_previos_externos: suma por empleadores externos (certificados/DJ)
 * - retenciones_previas_externas: retenciones reportadas de empleadores externos
 * - soporte_multiempleo_id / soporte_certificado_id / soporte_sin_previos_id
 * - soportes_json: snapshot JSON de los soportes usados (para auditoría)
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("quinta_calculos", "filial_retiene_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "contrato_id",
    });
    await queryInterface.addColumn("quinta_calculos", "origen_retencion", {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: "NINGUNO",
      after: "filial_retiene_id",
    });
    await queryInterface.addColumn("quinta_calculos", "es_secundaria", {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
      after: "origen_retencion",
    });
    await queryInterface.addColumn("quinta_calculos", "ingresos_previos_internos", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      after: "es_secundaria",
    });
    await queryInterface.addColumn("quinta_calculos", "ingresos_previos_externos", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      after: "ingresos_previos_internos",
    });
    await queryInterface.addColumn("quinta_calculos", "retenciones_previas_externas", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      after: "ingresos_previos_externos",
    });
    await queryInterface.addColumn("quinta_calculos", "soporte_multiempleo_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "retenciones_previas_externas",
    });
    await queryInterface.addColumn("quinta_calculos", "soporte_certificado_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "soporte_multiempleo_id",
    });
    await queryInterface.addColumn("quinta_calculos", "soporte_sin_previos_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: "soporte_certificado_id",
    });
    await queryInterface.addColumn("quinta_calculos", "soportes_json", {
      type: Sequelize.JSON,
      allowNull: true,
      after: "soporte_sin_previos_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("quinta_calculos", "soportes_json");
    await queryInterface.removeColumn("quinta_calculos", "soporte_sin_previos_id");
    await queryInterface.removeColumn("quinta_calculos", "soporte_certificado_id");
    await queryInterface.removeColumn("quinta_calculos", "soporte_multiempleo_id");
    await queryInterface.removeColumn("quinta_calculos", "retenciones_previas_externas");
    await queryInterface.removeColumn("quinta_calculos", "ingresos_previos_externos");
    await queryInterface.removeColumn("quinta_calculos", "ingresos_previos_internos");
    await queryInterface.removeColumn("quinta_calculos", "es_secundaria");
    await queryInterface.removeColumn("quinta_calculos", "origen_retencion");
    await queryInterface.removeColumn("quinta_calculos", "filial_retiene_id");
  },
};