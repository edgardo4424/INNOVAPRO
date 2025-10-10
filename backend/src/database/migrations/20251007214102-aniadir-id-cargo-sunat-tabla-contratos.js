"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("contratos_laborales", "id_cargo_sunat", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "cargos_sunat", // Nombre de la tabla referenciada
        key: "id", // Columna referenciada
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("contratos_laborales", "id_cargo_sunat");
  },
};
