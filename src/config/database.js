const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  config.development
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Base de datos conectada');
  } catch (error) {
    console.error('Error de conexión:', error);
  }
};

module.exports = connectDB;
