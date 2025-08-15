require('dotenv').config();
const sequelize = require('../src/database/sequelize');
const { Sequelize } = require('sequelize');

(async () => {
  try {
    // 1) Autenticar
    await sequelize.authenticate();

    // 2) Preguntar versión y TZ del servidor
    const [info] = await sequelize.query(
      'SELECT VERSION() AS version, @@sql_mode AS sql_mode, @@time_zone AS time_zone'
    );

    // 3) Ping mínimo
    const [ping] = await sequelize.query('SELECT 1 AS ok');

    console.log('✅ Conexión OK');
    console.table(info);
    console.log('Ping:', ping);

    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    // pistas rápidas
    if (/Access denied/i.test(err.message)) console.error('→ Revisa DB_USER/DB_PASSWORD y permisos.');
    if (/ENOTFOUND|getaddrinfo/i.test(err.message)) console.error('→ Revisa DB_HOST/puerto y conectividad.');
    if (/Unknown database/i.test(err.message)) console.error('→ La BD no existe. Crea la DB o usa db:create.');
    process.exit(1);
  }
})();