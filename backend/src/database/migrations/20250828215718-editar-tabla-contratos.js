'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Agregar columna numero_cuenta
    await queryInterface.addColumn('contratos_laborales', 'numero_cuenta', {
      type: Sequelize.STRING,
      allowNull: true, // cámbialo a false si quieres que sea obligatorio
    });

    // Agregar columna banco
    await queryInterface.addColumn('contratos_laborales', 'banco', {
      type: Sequelize.STRING,
      allowNull: true, // cámbialo a false si quieres que sea obligatorio
    });
  },

  async down (queryInterface, Sequelize) {  
    // Eliminar columnas en caso de rollback
    await queryInterface.removeColumn('contratos_laborales', 'numero_cuenta');
    await queryInterface.removeColumn('contratos_laborales', 'banco');
  }
};
