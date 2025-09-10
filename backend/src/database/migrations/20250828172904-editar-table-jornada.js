'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Cambiar columna `lugar` de ENUM a STRING
    await queryInterface.changeColumn('jornadas', 'lugar', {
      type: Sequelize.STRING,
      allowNull: false // si quieres permitir nulos cámbialo a true
    });
  },

  async down (queryInterface, Sequelize) {
    // Revertir el cambio: volver a ENUM
    await queryInterface.changeColumn('jornadas', 'lugar', {
      type: Sequelize.ENUM('almacen', 'obra'),
      allowNull: false
    });
  }
};
