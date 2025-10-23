'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Aniadir en la tabla trabajadores la columna correo

    await queryInterface.addColumn("trabajadores", "correo", {
          type: Sequelize.STRING,
          allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    
    // Eliminar la columna correo de la tabla trabajadores

    await queryInterface.removeColumn("trabajadores", "correo");
  }
};
