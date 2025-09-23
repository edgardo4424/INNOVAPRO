"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn("vacaciones", "dias_tomados");
      await queryInterface.removeColumn("vacaciones", "dias_vendidos");
      await queryInterface.removeColumn("vacaciones", "importe_dias_vendidos");
      await queryInterface.changeColumn("asistencias", "estado_asistencia", {
         type: Sequelize.ENUM(
            "presente",
            "falto",
            "tardanza",
            "permiso",
            "licencia_con_goce",
            "licencia_sin_goce",
            "vacaciones",
            "falta-justificada",
            "vacacion-gozada",
            "vacacion-vendida"
         ),
         allowNull: false,
         defaultValue: "presente",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.addColumn("vacaciones", "dias_tomados", {
         type: Sequelize.INTEGER,
         allowNull: false,
         defaultValue: 0,
      });

      await queryInterface.addColumn("vacaciones", "dias_vendidos", {
         type: Sequelize.INTEGER,
         allowNull: false,
         defaultValue: 0,
      });

      await queryInterface.addColumn("vacaciones", "importe_dias_vendidos", {
         type: Sequelize.FLOAT,
         allowNull: false,
         defaultValue: 0,
      });
      await queryInterface.changeColumn("asistencias", "estado_asistencia", {
         type: Sequelize.ENUM(
            "presente",
            "falto",
            "tardanza",
            "permiso",
            "licencia_con_goce",
            "licencia_sin_goce",
            "vacaciones",
            "falta-justificada"
         ),
         allowNull: false,
         defaultValue: "presente",
      });
   },
};
