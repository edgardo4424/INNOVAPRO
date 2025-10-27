'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Eliminar la columna 'id_cargo' de la tabla cargos_sunat
    await queryInterface.removeColumn('cargos_sunat', 'id_cargo');
  },

  async down (queryInterface, Sequelize) {

    // Revertir la eliminación de la columna 'id_cargo'
    await queryInterface.addColumn('cargos_sunat', 'id_cargo', {
      type: Sequelize.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
    });
  }
};
