'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('gratificaciones', 'cierre_id');

    await queryInterface.addColumn('gratificaciones', 'cierre_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'filial_id',
      references: {
        model: 'cierres_gratificaciones',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('gratificaciones', 'cierre_id');

    await queryInterface.addColumn('gratificaciones', 'cierre_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'filial_id',
      references: {
        model: 'cierres_gratificaciones',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  }
};
