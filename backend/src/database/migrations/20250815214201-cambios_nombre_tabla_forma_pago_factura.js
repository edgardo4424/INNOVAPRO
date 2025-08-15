'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('formas_pago_factura', 'forma_pago_factura');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable('forma_pago_factura', 'formas_pago_factura');

  }
};
