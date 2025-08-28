"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("cts", {
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
         },
         contratos: {
            type: Sequelize.JSON,
            allowNull: false,
         },
         periodo: {
            type: Sequelize.STRING(7),
            allowNull: false,
            comment: "Formato: YYYY-MM",
         },
         regimen: {
            type: Sequelize.ENUM("GENERAL", "MYPE"),
            allowNull: false,
         },
         sueldo_base: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
         },
         asignacion_familiar: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
         },
         promedio_horas_extras: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
         },
         promedio_bono_obra: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
         },
         remuneracion_computable: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
         },
         ultima_gratificacion: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
         },
         sexto_gratificacion: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
         },

         meses_computables: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         dias_computables: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         cts_meses: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
         },
         cts_dias: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
         },
         faltas_dias: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         faltas_importe: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
         },
         no_computable: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
         },
         cts_depositar: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
         },
         numero_cuenta: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         banco: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         locked_at: {
            type: Sequelize.DATE,
            allowNull: true,
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
         cierre_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
               model: "cierres_cts",
               key: "id",
            },
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
      await queryInterface.dropTable("cts");
   },
};
