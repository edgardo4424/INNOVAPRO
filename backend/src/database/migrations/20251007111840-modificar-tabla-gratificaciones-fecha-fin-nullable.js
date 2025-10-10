'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("gratificaciones", "fecha_fin", {
      type: Sequelize.DATEONLY,
      allowNull: true, // ahora permite null
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("gratificaciones", "fecha_fin", {
      type: Sequelize.DATEONLY,
      allowNull: false, // volvemos al estado original
    });
  }
};
