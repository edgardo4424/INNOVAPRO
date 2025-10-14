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
    await queryInterface.changeColumn('guias_de_remision', 'guia_Envio_Peso_Total', {
      type: Sequelize.DECIMAL(10, 4),
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
    await queryInterface.changeColumn('guias_de_remision', 'guia_Envio_Peso_Total', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  }
};

