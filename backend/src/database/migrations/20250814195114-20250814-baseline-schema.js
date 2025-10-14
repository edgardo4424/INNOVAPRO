'use strict';
const fs = require('fs');
const path = require('path');

function splitSqlStatements(raw) {
  // separa por ';' seguidos de salto de línea
  return raw
    .split(/;\s*[\r\n]+/g)
    .map(s => s.trim())
    .filter(s => s.length && !/^--/.test(s) && !/^\/\*/.test(s));
}

async function execSqlFile(queryInterface, filename) {
  const sqlPath = path.resolve(__dirname, 'sql', filename);
  const raw = fs.readFileSync(sqlPath, 'utf8');
  const statements = splitSqlStatements(raw);

  for (const stmt of statements) {
    await queryInterface.sequelize.query(stmt);
  }
}

module.exports = {
  async up(queryInterface) {
    await execSqlFile(queryInterface, 'baseline.sql');

  },

  async down() {
    // Por seguridad NO borramos nada en baseline
  }
};