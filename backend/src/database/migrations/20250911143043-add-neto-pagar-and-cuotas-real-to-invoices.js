'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('factura', 'neto_Pagar', {
      type: Sequelize.DECIMAL,
      allowNull: true,
    })
    await queryInterface.addColumn('factura', 'cuotas_Real', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('factura', 'neto_Pagar');
    await queryInterface.removeColumn('factura', 'cuotas_Real');
  }
};
