"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("asistencias", "estado_asistencia", {
      type: Sequelize.ENUM(
        "presente",
        "falto",
        "tardanza",
        "permiso",
        "licencia_con_goce",
        "licencia_sin_goce",
        "falta-justificada",
        "vacacion-gozada",
        "vacacion-vendida",
        "subsidio-maternidad",
        "subsidio-parternidad",
        "subsidio-accidente",
        "teletrabajo"
      ),
      allowNull: false,
      defaultValue: "presente",
    });
  },

  async down(queryInterface, Sequelize) {
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
};
