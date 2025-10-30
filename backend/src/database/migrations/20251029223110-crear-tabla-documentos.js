"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear la tabla 'documentos'
    await queryInterface.createTable("documentos", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      contrato_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "contratos", // nombre de la tabla referenciada
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      estado: {
        type: Sequelize.ENUM("borrador", "actualizado", "oficial"),
        allowNull: false,
        defaultValue: "borrador",
      },
      version: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      docx_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pdf_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    },
  {
    timestamps: true,
    tableName: "data_mantenimiento",
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    engine: 'InnoDB',
  });
  },

  async down(queryInterface, Sequelize) {
    
    // Eliminar la tabla 'documentos'
    await queryInterface.dropTable("documentos");
  },
};
