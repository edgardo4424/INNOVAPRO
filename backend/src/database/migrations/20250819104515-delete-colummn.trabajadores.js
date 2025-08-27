"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      //Se elimina las dependecias de la filial con los trabajadores
      await queryInterface.removeColumn("trabajadores", "filiales_asignadas");
      await queryInterface.removeColumn("trabajadores", "filial_id");
      await queryInterface.addColumn("trabajadores", "domiciliado", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: true,
      });
      await queryInterface.changeColumn("trabajadores", "asignacion_familiar", {
         type: Sequelize.DATEONLY,
         allowNull: true,
      });




      //Se añade la filial a los contratos laborales
      await queryInterface.addColumn("contratos_laborales", "filial_id", {
         type: Sequelize.INTEGER,
         allowNull: false,
         references: {
            model: { tableName: "empresas_proveedoras" },
            key: "id",
         },
         defaultValue: 1,
      });

      // Querie para agregar el ENUM de tipo de Bonos
      await queryInterface.addColumn("bonos", "tipo", {
         type: Sequelize.ENUM("simple", "bono_nocturno", "escolaridad"),
         allowNull: false,
         defaultValue: "simple",
      });

      // Querie para agregar el ENUM de tipo de adelanto de sueldo

      await queryInterface.addColumn("adelanto_sueldo", "tipo", {
         type: Sequelize.ENUM("simple", "gratificacion", "cts"),
         allowNull: false,
         defaultValue: "simple",
      });

      //Querie para saber cuanto es el importe de los dias vendidos
      await queryInterface.addColumn("vacaciones", "importe_dias_vendidos", {
         type: Sequelize.DECIMAL(10, 2),
         allowNull: true,
         defaultValue: 0,
      });


      //Quierie para actualizar el ENUM de la tabla asistencuas
      await queryInterface.removeColumn("asistencias", "estado_asistencia");

      await queryInterface.addColumn("asistencias", "estado_asistencia", {
         type: Sequelize.ENUM(
            "presente",
            "falto",
            "tardanza",
            "permiso",
            "licencia_con_goce",
            "licencia_sin_goce",
            "vacaciones",
            "falta-justificada"
         ),
         allowNull: false,
         defaultValue: "presente",
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("contratos_laborales", "filial_id");

      await queryInterface.addColumn("trabajadores", "filiales_asignadas", {
         type: Sequelize.JSON,
         allowNull: true,
      });

      await queryInterface.addColumn("trabajadores", "filial_id", {
         type: Sequelize.INTEGER,
         allowNull: true,
         references: {
            model: { tableName: "empresas_proveedoras" },
            key: "id",
         },
      });
      await queryInterface.removeColumn("adelanto_sueldo", "tipo");

      await queryInterface.removeColumn("bonos", "tipo");

      await queryInterface.removeColumn("vacaciones", "monto_dias_vendidos");

      await queryInterface.removeColumn("trabajadores", "domiciliado");

      await queryInterface.changeColumn("trabajadores", "asignacion_familiar", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });

      await queryInterface.removeColumn("asistencias", "estado");

      await queryInterface.addColumn("asistencias", "estado", {
         type: Sequelize.ENUM(
            "presente",
            "falto",
            "tardanza",
            "permiso",
            "licencia",
            "vacaciones",
            "falta-justificada"
         ),
         allowNull: false,
         defaultValue: "presente",
      });
   },
};
