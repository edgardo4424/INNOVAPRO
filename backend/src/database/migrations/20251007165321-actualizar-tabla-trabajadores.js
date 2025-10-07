'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("trabajadores", "cuspp_afp", {
         type: Sequelize.STRING(20),
         allowNull: true,
      });
      
      await queryInterface.addColumn("trabajadores", "estado_civil", {
         type: Sequelize.ENUM('SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'CONVIVIENTE'),
      });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn("trabajadores", "cuspp_afp");
    await queryInterface.removeColumn("trabajadores", "estado_civil");
  }
};
