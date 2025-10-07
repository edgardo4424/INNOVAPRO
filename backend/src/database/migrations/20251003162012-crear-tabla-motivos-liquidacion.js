"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("motivos_liquidacion", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      codigo: {
        type: Sequelize.STRING,
      },
      descripcion_larga: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descripcion_corta: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("motivos_liquidacion");
  },
};
