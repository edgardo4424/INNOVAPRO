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
    await queryInterface.changeColumn('factura', 'estado', {
      type: Sequelize.ENUM(
        "EMITIDA",
        "RECHAZADA",
        "ANULADA",
        "OBSERVADA",
        "ANULADA-NOTA",
        "MODIFICADA-NOTA",
        "PENDIENTE",
      ),
      allowNull: true,
    });
    await queryInterface.changeColumn('guias_de_remision', 'estado', {
      type: Sequelize.ENUM(
        "EMITIDA",
        "RECHAZADA",
        "ANULADA-NOTA",
        "MODIFICADA-NOTA",
        "ANULADA",
        "OBSERVADA",
        "PENDIENTE",
      ),
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
    await queryInterface.changeColumn('factura', 'estado', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('guias_de_remision', 'estado', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};

