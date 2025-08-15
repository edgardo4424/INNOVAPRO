'use strict';

const fs = require('fs');
const path = require('path');

// Lista blanca de tablas "importantes" que vas a poblar con el dump.
// Agrega o quita según tu caso:
const TABLES = [
  'areas',
  'atributos',
  'cargos',
  'costos_pernocte_transporte',
  'cotizaciones_transporte',
  'distritos_transporte',
  'empresas_proveedoras',
  'estados_cotizacion',
  'familias_piezas',
  'piezas',
  'piezas_usos',
  'stock',
  'tarifas_transporte',
  'tipos_trabajo',
  'ubigeos',
  'usos',
  'usuarios'
];

function loadAndCleanDump(dumpFile) {
  let sql = fs.readFileSync(dumpFile, 'utf8');

  // 1) Quitar comentarios y directivas de dump MySQL: /*! ... */, -- ..., # ...
  sql = sql
    .replace(/\/\*![\s\S]*?\*\//g, '') // bloques /*! ... */
    .replace(/-- .*$/gm, '')           // líneas que empiezan con --
    .replace(/# .*$/gm, '');           // líneas que empiezan con #

  // 2) Quitar LOCK/UNLOCK y ALTER TABLE ... KEYS
  sql = sql
    .replace(/LOCK TABLES[\s\S]*?;/gm, '')
    .replace(/UNLOCK TABLES;/gm, '')
    .replace(/ALTER TABLE[\s\S]*?DISABLE KEYS[\s\S]*?;/gm, '')
    .replace(/ALTER TABLE[\s\S]*?ENABLE KEYS[\s\S]*?;/gm, '');

  // 3) Partir por ; (fin de sentencia) y quedarnos con INSERTs de tablas whitelisted
  const statements = sql
    .split(/;\s*\n/)                   // separa en sentencias
    .map(s => s.trim())
    .filter(Boolean)
    .filter(stmt => {
      if (!/^INSERT\s+INTO\s+/i.test(stmt)) return false;
      const m = stmt.match(/^INSERT\s+INTO\s+`?([a-zA-Z0-9_]+)`?/i);
      if (!m) return false;
      return TABLES.includes(m[1]);
    })
    .map(stmt => (stmt.endsWith(';') ? stmt : `${stmt};`));

  return statements;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const dumpPath = path.join(__dirname, '.', 'seed-data', 'seeders.sql');
    const qi = queryInterface;

    // Carga y limpieza del dump
    const inserts = loadAndCleanDump(dumpPath);

    // Deshabilitar FK para insertar en cualquier orden
    await qi.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Limpieza previa (TRUNCATE) para datos idempotentes
    for (const t of TABLES) {
      // Algunos motores requieren comillas invertidas
      await qi.sequelize.query(`TRUNCATE TABLE \`${t}\``).catch(() => {});
    }

    // Ejecutar INSERTs uno por uno
    for (const stmt of inserts) {
      await qi.sequelize.query(stmt);
    }

    await qi.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down(queryInterface, Sequelize) {
    const qi = queryInterface;
    await qi.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const t of TABLES) {
      await qi.sequelize.query(`TRUNCATE TABLE \`${t}\``).catch(() => {});
    }
    await qi.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};