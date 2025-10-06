'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("contratos_laborales", "fecha_fin", {
      type: Sequelize.DATEONLY,
      allowNull: true, // ahora permite null
    });

    await queryInterface.addColumn("contratos_laborales", "es_indefinido", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("contratos_laborales", "fecha_fin", {
      type: Sequelize.DATEONLY,
      allowNull: false, // volvemos al estado original
    });

    await queryInterface.removeColumn("contratos_laborales", "es_indefinido");
  }
};
