'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('ruc_facturacion', 'nombre', 'razon_social');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('ruc_facturacion', 'razon_social', 'nombre');
  }
};
