"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  //Se agrega la columna filiales asignadas de tipo JSON
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("trabajadores", "filiales_asignadas", {
         type: Sequelize.JSON,
         allowNull: true,
      });
      //Se modifico la columna filial_id para que permita nulos
      await queryInterface.changeColumn("trabajadores", "filial_id", {
         type: Sequelize.INTEGER,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("trabajadores", "filiales_asignadas");
      await queryInterface.changeColumn("trabajadores", "filial_id", {
         type: Sequelize.INTEGER,
         allowNull: false,
      });
   },
};
