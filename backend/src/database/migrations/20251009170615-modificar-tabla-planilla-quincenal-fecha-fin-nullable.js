'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("planilla_quincenal", "fecha_fin", {
      type: Sequelize.DATEONLY,
      allowNull: true, // ahora permite null
    });

    await queryInterface.changeColumn("planilla_quincenal", "tipo_afp", {
      type: Sequelize.STRING,
      allowNull: true, // ahora permite null
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("planilla_quincenal", "fecha_fin", {
      type: Sequelize.DATEONLY,
      allowNull: false, // volvemos al estado original
    });

     await queryInterface.changeColumn("planilla_quincenal", "tipo_afp", {
      type: Sequelize.STRING,
      allowNull: true, // volvemos al estado original
    });
  }
};
