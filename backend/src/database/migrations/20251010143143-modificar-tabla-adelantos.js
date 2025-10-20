"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("adelanto_sueldo", "tipo", {
      type: Sequelize.ENUM("simple", "gratificacion", "cts", "prestamo"),
      allowNull: false,
      defaultValue: "simple",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("adelanto_sueldo", "tipo", {
      type: Sequelize.ENUM("simple", "gratificacion", "cts"),
      allowNull: false,
      defaultValue: "simple",
    });
  },
};
