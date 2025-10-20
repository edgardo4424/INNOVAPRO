'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('guia_transportista', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo_Doc: {
        type: Sequelize.STRING
      },
      nro_Doc: {
        type: Sequelize.STRING
      },
      nro_mtc: {
        type: Sequelize.STRING
      },
      razon_Social: {
        type: Sequelize.STRING
      },
      guia_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'guias_de_remision',
          key: 'id'
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('guia_transportista');
    await queryInterface.removeColumn('guia_transportista', 'guia_id');
  }
};

