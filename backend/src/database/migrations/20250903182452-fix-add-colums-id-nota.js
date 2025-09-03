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
    await queryInterface.addColumn('notas_credito_debito', 'factura_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: { tableName: 'factura' },
        key: 'id',
      },
    });
    await queryInterface.addColumn('notas_credito_debito', 'guia_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: { tableName: 'guias_de_remision' },
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('notas_credito_debito', 'factura_id');
    await queryInterface.removeColumn('notas_credito_debito', 'guia_id');
  }
};
