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
    await queryInterface.renameColumn('notas_credito_debito', 'Obeservacion', 'Observacion');
    await queryInterface.renameColumn('notas_credito_debito', 'tipo_Documento', 'estado_Documento');
    await queryInterface.renameColumn('notas_credito_debito', 'monto_Tmp_Venta', 'monto_Imp_Venta');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('notas_credito_debito', 'Observacion', 'Obeservacion');
    await queryInterface.renameColumn('notas_credito_debito', 'estado_Documento', 'tipo_Documento');
    await queryInterface.renameColumn('notas_credito_debito', 'monto_Imp_Venta', 'monto_Tmp_Venta');
  }
};
