'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // añadir columna tipo_afp de la tabla trabajadores
    await queryInterface.addColumn("trabajadores", "tipo_afp", {
      type: Sequelize.ENUM("HABITAT", "INTEGRA", "PRIMA", "PROFUTURO"),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    
    // eliminar columna tipo_afp de la tabla trabajadores
    await queryInterface.removeColumn("trabajadores", "tipo_afp");
  }
};
