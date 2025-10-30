"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("pases_pedidos", "fecha_confirmacion", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.removeColumn("pases_pedidos", "fecha_emision");
    await queryInterface.changeColumn("pedidos_guias", "estado", {
      type: Sequelize.ENUM(
        "Emitido",
        "Despachado",
      ),
      allowNull: false,
      defaultValue: "Emitido",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("pases_pedidos", "fecha_emision", {
      type: Sequelize.DATEONLY,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.removeColumn("pases_pedidos", "fecha_confirmacion");
  },
};
