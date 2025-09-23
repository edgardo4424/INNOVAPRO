"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("usuarios", "nombre");
    await queryInterface.removeColumn("usuarios", "rol");
    await queryInterface.removeColumn("usuarios", "telefono");

    // Añadir columnas
    await queryInterface.addColumn('usuarios', 'trabajador_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'trabajadores',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
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

    await queryInterface.removeColumn('usuarios', 'trabajador_id');
  },
};
