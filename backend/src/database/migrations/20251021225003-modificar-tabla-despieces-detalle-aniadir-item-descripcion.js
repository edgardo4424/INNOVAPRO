'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // aniadir a la tabla despieces_detalle la columna item
    await queryInterface.addColumn('despieces_detalle', 'item', {
      type: Sequelize.STRING,
      after: 'pieza_id', // Coloca la nueva columna después de 'pieza_id'
    });

    // aniadir descripcion
    await queryInterface.addColumn('despieces_detalle', 'descripcion', {
      type: Sequelize.STRING,
      after: 'item', // Coloca la nueva columna después de 'item'
    });
  },

  async down (queryInterface, Sequelize) {
    // eliminar la columna item de la tabla despieces_detalle
    await queryInterface.removeColumn('despieces_detalle', 'item');

    // eliminar la columna descripcion de la tabla despieces_detalle
    await queryInterface.removeColumn('despieces_detalle', 'descripcion');
  }
};
