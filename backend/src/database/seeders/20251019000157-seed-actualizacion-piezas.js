'use strict';


const fs = require("fs");
const path = require("path");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

   
      // Ejecutar el script previniendo los errores de ;
      // En mysql si ejecuta normal
      // Usa try catch y transacciones del archivo querys_piezas/unificacion_piezas_familia.sql

      const sqlFilePath = path.join(__dirname, '..', '..', 'querys_piezas', 'unificacion_piezas_familia.sql');
      const sqlQueries = fs.readFileSync(sqlFilePath, 'utf8').split(';').map(query => query.trim()).filter(query => query.length);
      
      for (const sql of sqlQueries) {
        try {
          await queryInterface.sequelize.query(sql);
        } catch (error) {
          console.error(`Error executing query: ${sql}\n`, error);
        }
      }


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
