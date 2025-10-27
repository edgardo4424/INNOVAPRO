'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Agrega la columna pdf_cotizacion_data_snapshot a la tabla cotizaciones
    await queryInterface.addColumn('cotizaciones', 'pdf_cotizacion_data_snapshot', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Snapshot de los datos del PDF de la cotización en el momento de crear el contrato'
    });
  },

  async down (queryInterface, Sequelize) {

    // Elimina la columna pdf_cotizacion_data_snapshot de la tabla cotizaciones
    await queryInterface.removeColumn('cotizaciones', 'pdf_cotizacion_data_snapshot');
  }
};
