"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("pedidos_guias", "guia_remision_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });

    await queryInterface.addColumn("pedidos_guias", "estado", {
      type: Sequelize.ENUM("Emitido", "Despacho"),
      allowNull: false,
    });
    await queryInterface.removeColumn("pedidos_guias", "tipo_guia");
    await queryInterface.removeColumn("pedidos_guias", "tipo_pedido");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("pedidos_guias", "tipo_guia", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("pedidos_guias", "tipo_pedido", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn("pedidos_guias", "estado");

    await queryInterface.changeColumn("pedidos_guias", "guia_remision_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
