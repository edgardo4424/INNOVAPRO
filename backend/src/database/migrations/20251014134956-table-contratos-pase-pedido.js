'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tabla contratos
    await queryInterface.createTable('contratos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      cotizacion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references:{
          model:"cotizaciones",
          key:"id",
        },
        onDelete:"RESTRICT",
        onUpdate:"RESTRICT"
      },
      notas_legales: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Crear tabla pases_de_pedido
    await queryInterface.createTable('pases_pedidos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      contrato_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'contratos',
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT',
      },
      fecha_emision: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM("CONFIRMADA","DESPACHO","DESPACHADO"),
        allowNull: false,
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pases_pedidos');
    await queryInterface.dropTable('contratos');
  },
};
