'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rol_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // ✅ El rol es obligatorio para todo usuario
        references: {
          model: 'roles', // 🔗 Se relaciona con la tabla roles
          key: 'id'
        },
        onUpdate: 'CASCADE', // 🔄 Si cambia el ID del rol, se actualiza automáticamente en usuarios
        onDelete: 'RESTRICT' // ❌ Previene borrar un rol si está siendo usado por algún usuario
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};
