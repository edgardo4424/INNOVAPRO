'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('permisos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      modulo_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // ✅ El modulo es obligatorio para todo permiso
        references: {
          model: 'modulos', // 🔗 Se relaciona con la tabla modulos
          key: 'id'
        },
        onUpdate: 'CASCADE', // 🔄 Si cambia el ID del modulo, se actualiza automáticamente en permisos
        onDelete: 'RESTRICT' // ❌ Previene borrar un permiso si está siendo usado por algún modulo
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('permisos');
  }
};
