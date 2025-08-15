'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ruc_facturacion', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ruc: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
      {
        tableName: "ruc_facturacion",
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        engine: 'InnoDB',
      }
    );

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ruc_facturacion');
  }
};
