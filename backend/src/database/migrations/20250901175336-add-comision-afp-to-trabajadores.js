'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('trabajadores', 'comision_afp', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('trabajadores', 'fecha_nacimiento', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('trabajadores', 'comision_afp');
    await queryInterface.removeColumn('trabajadores', 'fecha_nacimiento');
  }
};
