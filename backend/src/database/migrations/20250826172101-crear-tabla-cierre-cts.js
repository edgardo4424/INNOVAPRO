"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("cierres_cts", {
         id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         filial_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: "empresas_proveedoras",
               key: "id",
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
         },
         periodo: {
            type: Sequelize.STRING(7),
            allowNull: false,
            comment: "Formato: YYYY-MM",
         },
         locked_at: {
            type: Sequelize.DATE,
            comment: "Fecha de cierre oficial del periodo",
         },
         usuario_cierre_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: "usuarios",
               key: "id",
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
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
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("cierres_cts");
   },
};
