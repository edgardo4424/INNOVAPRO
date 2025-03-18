require("dotenv").config();
const { Sequelize } = require("sequelize");

//Detectamos si estamos en producción o en desarrollo
const isProduction = process.env.NODE_ENV == "production";

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
      },
      pool: {
            max: isProduction ? 5 : 2, // Ajustamos según el entorno
            min: 0,
            acquire: 10000, // Tiempo máximo para obtener una conexión
            idle: 5000 // Tiempo antes de liberar una conexión inactiva
      }
    }
  );
  
module.exports = sequelize;