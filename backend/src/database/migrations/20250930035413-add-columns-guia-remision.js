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
    await queryInterface.addColumn('guias_de_remision', 'obra', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('guias_de_remision', 'nro_contrato', {
      type: Sequelize.STRING(100),
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
    await queryInterface.removeColumn('guias_de_remision', 'obra');
    await queryInterface.removeColumn('guias_de_remision', 'nro_contrato');
  }
};
