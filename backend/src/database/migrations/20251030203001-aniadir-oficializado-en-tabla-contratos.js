'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Añadir la columna 'oficializado' a la tabla 'contratos'
    await queryInterface.addColumn('contratos', 'oficializado', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) {
    // Eliminar la columna 'oficializado' de la tabla 'contratos'
    await queryInterface.removeColumn('contratos', 'oficializado');
  }
};
