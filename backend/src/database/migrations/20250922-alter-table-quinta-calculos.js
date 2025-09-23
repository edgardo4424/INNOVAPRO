'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Eliminar la columna ingresos_previos_acum (para reubicarla)
    await queryInterface.removeColumn('quinta_calculos', 'ingresos_previos_acum');

    // 2. Volver a crear ingresos_previos_acum justo después de ingresos_previos_internos
    await queryInterface.addColumn('quinta_calculos', 'ingresos_previos_acum', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0
    }, {
      after: 'ingresos_previos_internos' // solo funciona en MySQL/MariaDB
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir: volver a dejar las columnas como estaban
    await queryInterface.removeColumn('quinta_calculos', 'ingresos_previos_acum');
    await queryInterface.addColumn('quinta_calculos', 'ingresos_previos_acum', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0
    });
  }
};
