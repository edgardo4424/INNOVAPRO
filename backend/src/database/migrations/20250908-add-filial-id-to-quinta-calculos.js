'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('quinta_calculos', 'filial_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'contrato_id',
    });
    await queryInterface.addIndex('quinta_calculos', ['dni', 'anio', 'mes', 'filial_id'], {
      name: 'idx_quinta_dni_anio_mes_filial',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('quinta_calculos', 'idx_quinta_dni_anio_mes_filial');
    await queryInterface.removeColumn('quinta_calculos', 'filial_id');
  }
};