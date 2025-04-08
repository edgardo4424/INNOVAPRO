'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tareas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      empresaProveedoraId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'empresas_proveedoras',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      clienteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clientes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      obraId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'obras',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ubicacion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipoTarea: {
        type: Sequelize.ENUM(
          'Apoyo Técnico',
          'Apoyo Administrativo',
          'Pase de Pedido',
          'Servicios Adicionales',
          'Tarea Interna'
        ),
        allowNull: false,
      },
      urgencia: {
        type: Sequelize.ENUM('Prioridad', 'Normal', 'Baja prioridad'),
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM('Pendiente', 'En proceso', 'Finalizada', 'Cancelada'),
        defaultValue: 'Pendiente',
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tareas');
  },
};