'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    // Eliminar la columna 'cotizacion_id' de la tabla 'condiciones_alquiler'
    await queryInterface.removeColumn('condiciones_alquiler', 'cotizacion_id');
    
    // Agregar la columna 'contrato_id' referenciando a la tabla 'contratos'
    await queryInterface.addColumn('condiciones_alquiler', 'contrato_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'contratos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down (queryInterface, Sequelize) {
    
    // Añadir la columna 'cotizacion_id' a la tabla 'condiciones_alquiler'
    await queryInterface.addColumn('condiciones_alquiler', 'cotizacion_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'cotizaciones',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
    
    // Eliminar la columna 'contrato_id' de la tabla 'condiciones_alquiler'
    await queryInterface.removeColumn('condiciones_alquiler', 'contrato_id');
  }
};
