require("dotenv").config();
const { Sequelize } = require("sequelize");

// 🔥 Asegurar que DB_DIALECT sea string puro sin comillas raras
const dbDialect = process.env.DB_DIALECT.replace(/['"]+/g, '').trim();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
};

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
    process.env.DB_NAME,   // Nombre de la base de datos
    process.env.DB_USER,   // Usuario de la base de datos
    process.env.DB_PASSWORD, // Contraseña
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || "mysql",
      logging: false, // Para evitar logs en la consola
      define: {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci"
      }
    }
  );
  
module.exports = sequelize;