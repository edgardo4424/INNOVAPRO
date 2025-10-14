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
    await queryInterface.addColumn('factura', 'precio_dolar', {
      type: Sequelize.DECIMAL(12, 6),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('notas_credito_debito', 'precio_dolar', {
      type: Sequelize.DECIMAL(12, 6),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('factura', 'precio_dolar');
    await queryInterface.removeColumn('notas_credito_debito', 'precio_dolar');
  }
};
