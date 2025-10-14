'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('trabajadores', 'quinta_categoria');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('trabajadores', 'quinta_categoria', {
      type: Sequelize.BOOLEAN,  // Tipo original TINYINT(1)
      allowNull: false,         // Según la captura no permite NULL
      defaultValue: 0           // Según tu tabla, default es 0
    });
  }
};
