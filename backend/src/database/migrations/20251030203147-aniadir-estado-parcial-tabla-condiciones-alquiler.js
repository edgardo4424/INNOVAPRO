'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // Añadir el estado PARCIAL al ENUM de la columna 'condiciones_alquiler' en la tabla 'condiciones_alquiler'
     await queryInterface.changeColumn('condiciones_alquiler', 'estado', {
      type: Sequelize.ENUM(
        "PENDIENTE",
        "DEFINIDAS",
        "PARCIAL",
        "CUMPLIDAS"
      ),
      defaultValue: "PENDIENTE",
    });
  },

  async down (queryInterface, Sequelize) {
    
    // volver a la versión anterior del ENUM sin el estado PARCIAL
    await queryInterface.changeColumn('condiciones_alquiler', 'estado', {
      type: Sequelize.ENUM(
        "PENDIENTE",
        "DEFINIDAS",
        "CUMPLIDAS"
      ),
    });
  }
};
