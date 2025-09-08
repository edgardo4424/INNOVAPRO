"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "bajas_trabajadores",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        trabajador_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "trabajadores",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        contrato_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "contratos_laborales",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        fecha_baja: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        motivo: {
          type: Sequelize.ENUM(
            "RENUNCIA",
            "DESPIDO",
            "FIN CONTRATO",
            "MUTUO ACUERDO"
          ),
          allowNull: false,
          defaultValue: "FIN CONTRATO",
        },
        observacion: {
          type: Sequelize.TEXT,
        },
        usuario_registro_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "usuarios",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        estado_liquidacion: {
          type: Sequelize.ENUM("CALCULADA", "PAGADA"),
          allowNull: false,
          defaultValue: "CALCULADA",
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        timestamps: true,
        tableName: "bajas_trabajadores",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        engine: "InnoDB",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Eliminar ENUMs antes de eliminar la tabla para evitar errores en algunos motores
    await queryInterface.dropTable("bajas_trabajadores");
   
  },
};
