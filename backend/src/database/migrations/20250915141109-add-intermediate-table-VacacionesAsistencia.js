'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('asistencias_vacaciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      asistencia_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
        references: {
          model: 'asistencias',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // si se borra la asistencia, se mantiene la solicitud
      },
      vacaciones_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vacaciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      tipo: {
        type: Sequelize.ENUM('gozada', 'vendida'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    await queryInterface.addColumn('vacaciones', 'estado', {
      type: Sequelize.ENUM('pendiente', 'aprobada', 'rechazada'),
      allowNull: false,
      defaultValue: 'pendiente'
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('asistencias_vacaciones');
    await queryInterface.removeColumn('vacaciones', 'estado');
  }
};

