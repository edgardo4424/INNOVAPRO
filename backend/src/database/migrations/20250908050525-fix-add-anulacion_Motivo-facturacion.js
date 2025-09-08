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
    await queryInterface.addColumn('factura', 'anulacion_Motivo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('guias_de_remision', 'anulacion_Motivo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('notas_credito_debito', 'anulacion_Motivo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('factura', 'anulacion_Motivo');
    await queryInterface.removeColumn('guias_de_remision', 'anulacion_Motivo');
    await queryInterface.removeColumn('notas_credito_debito', 'anulacion_Motivo');
  }
};
