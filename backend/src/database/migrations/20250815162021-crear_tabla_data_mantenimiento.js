'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('data_mantenimiento', {
       id: {
         type: Sequelize.INTEGER,
         autoIncrement: true,
         primaryKey: true,
       },
       codigo: {
         type: Sequelize.STRING,
         allowNull: false,
         unique: true,
       },
       nombre: {
         type: Sequelize.STRING,
         allowNull: false,
       },
       descripcion: {
         type: Sequelize.TEXT,
         allowNull: false,
       },
       valor: {
           type: Sequelize.DECIMAL(10, 2),
           defaultValue: 0.00,
       },
       actualizado_por: {
           type: Sequelize.INTEGER,
       },
       createdAt: {
         allowNull: false,
         type: Sequelize.DATE
       },
       updatedAt: {
         allowNull: false,
         type: Sequelize.DATE
       }
    },
    
  {
    timestamps: true,
    tableName: "data_mantenimiento",
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    engine: 'InnoDB',
  });
 
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('data_mantenimiento');
  }
};

