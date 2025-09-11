"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("adelanto_sueldo", "primera_cuota", {
         type: Sequelize.DATEONLY,
         allowNull: false,
      });
      await queryInterface.addColumn("adelanto_sueldo", "forma_descuento", {
         type: Sequelize.ENUM("mensual", "quincenal"),
         allowNull: true,
      });

      await queryInterface.addColumn("adelanto_sueldo", "cuotas", {
         type: Sequelize.INTEGER,
         allowNull: false,
         defaultValue: 1,
      });

      await queryInterface.addColumn("adelanto_sueldo", "cuotas_pagadas", {
         type: Sequelize.INTEGER,
         allowNull: false,
         defaultValue: 0,
      });
      
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("adelanto_sueldo", "forma_descuento");
      await queryInterface.removeColumn("adelanto_sueldo", "cuotas");
      await queryInterface.removeColumn("adelanto_sueldo", "cuotas_pagadas");
   },
};
