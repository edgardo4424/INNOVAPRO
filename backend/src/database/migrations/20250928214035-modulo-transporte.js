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

    // ! Tabla transportistas
    await queryInterface.createTable("transportistas", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nro_doc: {
        type: Sequelize.STRING(12),
        allowNull: false,
        unique: true,
      },
      razon_social: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      nro_mtc: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // ! Tabla choferes
    await queryInterface.createTable("choferes", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombres: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      apellidos: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      nro_licencia: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      nro_doc: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      tipo_doc: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // ! Tabla vehiculos
    await queryInterface.createTable("vehiculos", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nro_placa: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      marca: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      tuce_certificado: {
        type: Sequelize.STRING(40),
        allowNull: true,
      },
      id_transportista: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "transportistas",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("vehiculos");
    await queryInterface.dropTable("choferes");
    await queryInterface.dropTable("transportistas");
  }
};
