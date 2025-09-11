'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('factura', 'orden_compra', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('factura', 'dias_pagar', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('factura', 'fecha_vencimiento', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('factura', 'orden_compra');
    await queryInterface.removeColumn('factura', 'dias_pagar');
    await queryInterface.removeColumn('factura', 'fecha_vencimiento');
  }
};
