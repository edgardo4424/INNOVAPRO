"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contratos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ref_contrato: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cotizacion_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "cotizaciones",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      fecha_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fecha_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      clausulas_adicionales: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      requiere_valo_adelantada: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      renovaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM(
          'PROGRAMADO',
          'VIGENTE',
          'POR VENCER',
          'VENCIDO',
          'FIRMADO'
        ),
        allowNull: false,
        defaultValue: 'PROGRAMADO',
      },
      /* despiece snapshot + derived summary columns */
      despiece_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      despiece_version: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      despiece_snapshot: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      peso_estimado_kg: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
        defaultValue: 0.00,
      },
      cantidad_items: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      total_precio_soles: {
        type: Sequelize.DECIMAL(12,2),
        allowNull: true,
        defaultValue: 0.00,
      },
      total_precio_dolares: {
        type: Sequelize.DECIMAL(12,2),
        allowNull: true,
        defaultValue: 0.00,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // remove enum type by dropping table first
    await queryInterface.dropTable('contratos');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_contratos_estado"');
  },
};
