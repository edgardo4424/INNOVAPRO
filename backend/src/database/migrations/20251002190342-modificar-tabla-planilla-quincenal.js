'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('planilla_quincenal', 'tipo_afp', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'regimen'
    });
    await queryInterface.addColumn('planilla_quincenal', 'cargo', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'tipo_contrato'
    });
  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.removeColumn('planilla_quincenal', 'tipo_afp');
    await queryInterface.removeColumn('planilla_quincenal', 'cargo');
  }
};
