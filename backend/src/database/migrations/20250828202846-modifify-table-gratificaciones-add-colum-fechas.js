'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // añadir columna tipo_afp de la tabla gratificaciones
    await queryInterface.addColumn("gratificaciones", "fecha_ingreso", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

     await queryInterface.addColumn("gratificaciones", "fecha_fin", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    
    // eliminar columna tipo_afp de la tabla gratificaciones
    await queryInterface.removeColumn("gratificaciones", "fecha_ingreso");
     await queryInterface.removeColumn("gratificaciones", "fecha_fin");
  }
};
