"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("usuarios", "nombre");
    await queryInterface.removeColumn("usuarios", "rol");
    await queryInterface.removeColumn("usuarios", "telefono");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("usuarios", "nombre", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("usuarios", "rol", {
      type: Sequelize.ENUM(
        "Gerencia",
        "Ventas",
        "Oficina Técnica",
        "Almacén",
        "Administración",
        "Clientes"
      ),
      allowNull: false,
    });

    await queryInterface.addColumn("usuarios", "telefono", {
      type: Sequelize.STRING(10),
    });
  },
};
