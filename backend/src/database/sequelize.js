const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV; // Dev o Prod
const cfg = require('./config/config')[env]; // con el [env] seleccionamos la configuracion dependiendo el entorno

const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg);
module.exports = sequelize;