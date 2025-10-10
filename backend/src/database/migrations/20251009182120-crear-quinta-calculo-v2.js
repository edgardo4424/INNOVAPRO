// INNOVA PRO+ v1.3.0 - Migración quinta_calculos (rebuild ordenado)
"use strict";

/**
 * NOTAS:
 * - Se respalda la tabla actual renombrándola a quinta_calculos_backup_YYYYMMDDHHmm
 * - Se crea la nueva estructura solicitada por Andrés.
 * - Los campos soporte_*_id NO tienen FK aún (se agregarán cuando existan esas tablas).
 * - Se renombran conceptos: filial_id -> filial_actual_id.
 * - 'fuente_previos' usa ENUM('AUTO','CERTIFICADO','SIN_PREVIOS') de acuerdo a uso actual.
 */

const TABLE = "quinta_calculos";

function tsBackupSuffix() {
  const d = new Date();
  const z = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}${z(d.getHours())}${z(d.getMinutes())}`;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    // 1) Respaldar tabla existente (si existe)
    const qi = queryInterface;
    const describe = await qi.sequelize.getQueryInterface().showAllSchemas();
    const hasTable = await qi.sequelize
      .query(`SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = '${TABLE}'`, { type: Sequelize.QueryTypes.SELECT })
      .then(r => Number(r?.[0]?.c) > 0);

    let backupName = null;
    if (hasTable) {
      backupName = `${TABLE}_backup_${tsBackupSuffix()}`;
      await qi.renameTable(TABLE, backupName);
    }

    // 2) Crear nueva tabla ordenada
    await qi.createTable(TABLE, {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      // Identificadores
      trabajador_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      contrato_id:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      filial_actual_id: { type: DataTypes.INTEGER, allowNull: true },   // renombrado desde filial_id
      es_secundaria: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
      filial_retenedora_id: { type: DataTypes.INTEGER, allowNull: true },

      dni:  { type: DataTypes.STRING(15), allowNull: false },
      anio: { type: DataTypes.INTEGER, allowNull: false },
      mes:  { type: DataTypes.INTEGER, allowNull: false },

      // Parámetros tributarios
      uit_valor:         { type: DataTypes.DECIMAL(10,2), allowNull: false },
      deduccion_fija_uit:{ type: DataTypes.DECIMAL(6,2), allowNull: false },
      divisor_calculo:{ type: DataTypes.INTEGER, allowNull: false },

      // Auditoría de creación
      creado_por:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      es_recalculo: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },

      // Soportes (IDs a detallar luego con FKs)
      soporte_multi_interno_id: { type: DataTypes.INTEGER, allowNull: true },
      soporte_multiempleo_id:   { type: DataTypes.INTEGER, allowNull: true },
      soporte_certificado_id:   { type: DataTypes.INTEGER, allowNull: true },
      soporte_sin_previos_id:   { type: DataTypes.INTEGER, allowNull: true },

      // Fuente de previos (según motor actual)
      fuente_previos: {
        type: DataTypes.ENUM("AUTO", "CERTIFICADO", "SIN_PREVIOS"),
        allowNull: false,
        defaultValue: "AUTO",
      },

      // Previos (internos/externos)
      ingresos_previos_internos:            { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      ingresos_previos_externos:            { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      ingresos_previos_acum_filial_actual:  { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },

      // Entradas actuales/proyección base
      remuneracion_mensual_filial_actual: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      bonos:                 { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      asignacion_familiar:   { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },

      // Grati y AF ya pagadas (reales)
      grati_julio_pagada:       { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      grati_diciembre_pagada:   { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      grati_pagadas_otras:      { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      asignacion_familiar_total_otras: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },

      // Proyecciones del año
      grati_julio_proj:        { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      grati_diciembre_proj:    { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      otros_ingresos_proj:     { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      asignacion_familiar_proj:{ type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },

      // Otras filiales (multi interno)
      remu_proj_total_otras:             { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      grati_proj_total_otras:            { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      asignacion_familiar_proj_otras:    { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },

      // Retenciones previas (detalle)
      origen_retencion: { 
          type: DataTypes.STRING(32), 
          allowNull: false, 
          defaultValue: "NINGUNO" 
        },
      retenciones_previas_internas:       { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
      retenciones_previas_externas:       { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
      retenciones_previas_filial_actual:  { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },

      // Mes en curso / ajustes
      extra_gravado_mes:       { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      retencion_adicional_mes: { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },

      // Resultados anuales y snapshot de tramos
      bruto_anual_proyectado: { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
      renta_neta_anual:       { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
      tramos_usados_json:     { type: DataTypes.JSON, allowNull: false },

      impuesto_anual:      { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
      retencion_base_mes:  { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },

      // Timestamps
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    }, {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    });

    // 3) Índices útiles
    await qi.addIndex(TABLE, ["dni", "anio", "mes"], { name: "idx_quinta_dni_anio_mes" });
    await qi.addIndex(TABLE, ["trabajador_id", "anio", "mes"], { name: "idx_quinta_trabajador_anio_mes" });
    await qi.addIndex(TABLE, ["filial_actual_id", "anio", "mes"], { name: "idx_quinta_filial_anio_mes" });
    await qi.addIndex(TABLE, ["fuente_previos"], { name: "idx_quinta_fuente_previos" });
    await qi.addIndex(TABLE, ["es_recalculo"], { name: "idx_quinta_es_recalculo" });

    // 4) (Opcional) FKs suaves a entidades base ya existentes
    //    Si alguna no existiera en tu esquema, comenta la línea correspondiente.
    try {
      await qi.addConstraint(TABLE, {
        fields: ["trabajador_id"],
        type: "foreign key",
        name: "fk_quinta_trabajador",
        references: { table: "trabajadores", field: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    } catch (_) {}
    try {
      await qi.addConstraint(TABLE, {
        fields: ["contrato_id"],
        type: "foreign key",
        name: "fk_quinta_contrato",
        references: { table: "contratos_laborales", field: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    } catch (_) {}
    try {
      await qi.addConstraint(TABLE, {
        fields: ["filial_actual_id"],
        type: "foreign key",
        name: "fk_quinta_filial_actual",
        references: { table: "filiales", field: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    } catch (_) {}
    try {
      await qi.addConstraint(TABLE, {
        fields: ["filial_retenedora_id"],
        type: "foreign key",
        name: "fk_quinta_filial_retenedora",
        references: { table: "filiales", field: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    } catch (_) {}
    try {
      await qi.addConstraint(TABLE, {
        fields: ["creado_por"],
        type: "foreign key",
        name: "fk_quinta_creado_por",
        references: { table: "usuarios", field: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    } catch (_) {}

    // 5) (Info) Si hicimos backup, dejamos el nombre registrado en un comment
    if (backupName) {
      await qi.sequelize.query(`ALTER TABLE ${TABLE} COMMENT = 'Rebuild ${TABLE}. Backup: ${backupName}'`);
    }
  },

  async down(queryInterface, Sequelize) {
    const qi = queryInterface;

    // 1) Eliminar la nueva
    const hasNew = await qi.sequelize
      .query(`SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = '${TABLE}'`, { type: Sequelize.QueryTypes.SELECT })
      .then(r => Number(r?.[0]?.c) > 0);

    if (hasNew) {
      // Borrar índices para evitar errores de dependencia
      try { await qi.removeIndex(TABLE, "idx_quinta_dni_anio_mes"); } catch (_) {}
      try { await qi.removeIndex(TABLE, "idx_quinta_trabajador_anio_mes"); } catch (_) {}
      try { await qi.removeIndex(TABLE, "idx_quinta_filial_anio_mes"); } catch (_) {}
      try { await qi.removeIndex(TABLE, "idx_quinta_fuente_previos"); } catch (_) {}
      try { await qi.removeIndex(TABLE, "idx_quinta_es_recalculo"); } catch (_) {}

      // Borrar constraints si existen
      for (const name of [
        "fk_quinta_trabajador",
        "fk_quinta_contrato",
        "fk_quinta_filial_actual",
        "fk_quinta_filial_retenedora",
        "fk_quinta_creado_por",
      ]) {
        try { await qi.removeConstraint(TABLE, name); } catch (_) {}
      }

      await qi.dropTable(TABLE);
    }

    // 2) Restaurar backup (si existiera; tomamos el más reciente)
    const backups = await qi.sequelize.query(
      `SELECT table_name AS t FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name LIKE '${TABLE}_backup_%'
       ORDER BY create_time DESC`, // create_time solo en MySQL 8+; si no, igual cogerá un orden
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (Array.isArray(backups) && backups.length > 0) {
      const name = backups[0].t;
      await qi.renameTable(name, TABLE);
    }
  },
};