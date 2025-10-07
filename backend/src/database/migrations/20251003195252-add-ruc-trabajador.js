"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("trabajadores", "ruc", {
      type: Sequelize.STRING(11),
      allowNull: true,
    });
    await queryInterface.addColumn("planilla_mensual", "ruc", {
      type: Sequelize.STRING(11),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("trabajadores", "ruc");
    await queryInterface.removeColumn("planilla_mensual", "ruc");

  },
};
