'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn("contratos_laborales", "numero_cuenta_cts", {
         type: Sequelize.STRING,
         allowNull: true,
      })
  },

  async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn("contratos_laborales", "numero_cuenta_cts");
  }
};
