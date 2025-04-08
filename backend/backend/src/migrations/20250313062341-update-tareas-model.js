"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Tareas", "asignadoA", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Usuarios", // Nombre de la tabla en la BD
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });

    await queryInterface.changeColumn("Tareas", "estado", {
      type: Sequelize.ENUM("Pendiente", "En proceso", "Finalizada", "Devuelta", "Cancelada"),
      allowNull: false,
      defaultValue: "Pendiente"
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Tareas", "asignadoA");

    await queryInterface.changeColumn("Tareas", "estado", {
      type: Sequelize.ENUM("Pendiente", "En proceso", "Finalizada"),
      allowNull: false,
      defaultValue: "Pendiente"
    });
  }
};