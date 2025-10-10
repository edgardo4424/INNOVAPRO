"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "planilla_mensual",
      "bonos_extraordinarios",
      {
        type: Sequelize.FLOAT,
        allowNull: false,
      }
    );
    await queryInterface.addColumn("planilla_mensual", "sub_total", {
      type: Sequelize.FLOAT,
      allowNull: false,
    });
    await queryInterface.changeColumn("bonos", "tipo", {
      type: Sequelize.ENUM(
        "simple",
        "bono_nocturno",
        "escolaridad",
        "extraordinario"
      ),
      allowNull: false,
      defaultValue: "simple",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("bonos", "tipo", {
      type: Sequelize.ENUM("simple", "bono_nocturno", "escolaridad"),
      allowNull: false,
      defaultValue: "simple",
    });
    await queryInterface.removeColumn("planilla_mensual", "sub_total"),
      await queryInterface.removeColumn(
        "planilla_mensual",
        "bonos_extraordinarios"
      );
  },
};
