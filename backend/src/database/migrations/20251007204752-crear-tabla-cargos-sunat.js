'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("cargos_sunat", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_cargo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cargos", // nombre de la tabla referenciada
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT", // puedes cambiar a "CASCADE" si quieres que se eliminen también
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("cargos_sunat");
  }
};
