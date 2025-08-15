'use strict'; 
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('adelanto_sueldo', {
      id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            trabajador_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: { tableName: "trabajadores"},
                  key: "id",
               },
               onUpdate: 'CASCADE',
               onDelete: 'RESTRICT'
            },
            fecha: {
               type: Sequelize.DATEONLY,
               allowNull: false,
            },
            monto: {
               type: Sequelize.DECIMAL(10,2),
               allowNull: false,
            },
            observacion: {
               type: Sequelize.STRING,
               allowNull: true,
            },
            estado: {
               type: Sequelize.BOOLEAN,
               allowNull: false,
               defaultValue: true, // activo
            },
    },
    {
      tableName: "adelanto_sueldo",
    } ,
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        engine: 'InnoDB',
      }
  );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('adelanto_sueldo');
  }
};