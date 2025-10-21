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
    await queryInterface.renameColumn('guia_choferes', 'tipo_doc', 'tipo_Doc');
    await queryInterface.renameColumn('guia_choferes', 'nro_doc', 'nro_Doc');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('guia_choferes', 'tipo_Doc', 'tipo_doc');
    await queryInterface.renameColumn('guia_choferes', 'nro_Doc', 'nro_doc');
  }
};
