require('dotenv').config(); //Llamamos las variables de entorno

//Detectamos si estamos en producción o en desarrollo
const isProduction = process.env.NODE_ENV == "production";

const common = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false, // Para evitar logs en la consola
    dialectOptions: {
      // Recomendado para números grandes y fechas
      supportBigNumbers: true,
      bigNumberStrings: true
    },
     timezone: "-05:00", // ⬅️ HORA PERUANA
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci" 
      },
    pool: {
        max: isProduction ? 30 : 20, // Ajustamos según el entorno
        min: 5,
        acquire: 30000, // Tiempo máximo para obtener una conexión
        idle: 10000 // Tiempo antes de liberar una conexión inactiva
    }
};

module.exports = {
    development: {...common, logging: false},
    production: {...common, logging: false},
}