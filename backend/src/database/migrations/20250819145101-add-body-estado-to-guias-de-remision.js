'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('guias_de_remision', 'body', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('guias_de_remision', 'estado', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('guias_de_remision', 'estado');
    await queryInterface.removeColumn('guias_de_remision', 'body');
  }
};
