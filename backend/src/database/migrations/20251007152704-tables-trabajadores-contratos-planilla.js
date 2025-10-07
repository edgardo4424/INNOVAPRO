"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn(
         "contratos_laborales",
         "numero_cuenta_cts",
         {
            type: Sequelize.STRING,
            allowNull: true,
         }
      );
      await Promise.all([
         queryInterface.addColumn(
            "planilla_mensual",
            "dias_falta",
            {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
            }
         ),
         queryInterface.addColumn("planilla_mensual", "dias_vacaciones", {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
         }),
         queryInterface.addColumn(
            "planilla_mensual",
            "dias_licencia_con_goce",
            {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
            }
         ),
         queryInterface.addColumn(
            "planilla_mensual",
            "dias_licencia_sin_goce",
            {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
            }
         ),
         queryInterface.addColumn(
            "planilla_mensual",
            "dias_falta_justificada",
            {
               type: Sequelize.INTEGER,
               allowNull: true,
               defaultValue: 0,
            }
         ),
         queryInterface.addColumn("planilla_mensual", "dias_tardanza", {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
         }),
         queryInterface.addColumn("planilla_mensual", "dias_permiso", {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
         }),
         queryInterface.addColumn("planilla_mensual", "domiciliado", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
         }),
      ]);
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn(
         "contratos_laborales",
         "numero_cuenta_cts"
      );
      await Promise.all([
         queryInterface.removeColumn(
            "planilla_mensual",
            "dias_falta"
         ),
         queryInterface.removeColumn("planilla_mensual", "dias_vacaciones"),
         queryInterface.removeColumn(
            "planilla_mensual",
            "dias_licencia_con_goce"
         ),
         queryInterface.removeColumn(
            "planilla_mensual",
            "dias_licencia_sin_goce"
         ),
         queryInterface.removeColumn(
            "planilla_mensual",
            "dias_falta_justificada"
         ),
         queryInterface.removeColumn("planilla_mensual", "dias_tardanza"),
         queryInterface.removeColumn("planilla_mensual", "dias_permiso"),
         queryInterface.removeColumn("planilla_mensual", "domiciliado"),

      ]);
   },
};
