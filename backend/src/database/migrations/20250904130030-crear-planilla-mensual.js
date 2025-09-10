"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("cierres_planilla_mensual", {
         id: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn("NOW"),
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn("NOW"),
         },
      });
      await queryInterface.createTable("planilla_mensual", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         trabajador_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: "trabajadores",
               key: "id",
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
         },
         contrato_id: {
            type: Sequelize.INTEGER,
            references: {
               model: "contratos_laborales",
               key: "id",
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
            allowNull:false
         },
         tipo_contrato: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         periodo: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         fecha_calculo: {
            type: Sequelize.DATEONLY,
            allowNull: false,
         },
         tipo_documento: {
            type: Sequelize.STRING,
         },
         numero_documento: {
            type: Sequelize.STRING,
         },
         nombres_apellidos: {
            type: Sequelize.STRING,
         },
         area: {
            type: Sequelize.STRING,
         },
         afp: {
            type: Sequelize.STRING,
         },
         fecha_ingreso: {
            type: Sequelize.DATE,
         },
         dias_labor: {
            type: Sequelize.INTEGER,
         },
         sueldo_basico: {
            type: Sequelize.FLOAT,
         },
         sueldo_del_mes: {
            type: Sequelize.FLOAT,
         },
         asig_fam: {
            type: Sequelize.FLOAT,
         },
         descanso_medico: {
            type: Sequelize.FLOAT,
         },
         licencia_con_goce_de_haber: {
            type: Sequelize.FLOAT,
         },
         licencia_sin_goce_de_haber: {
            type: Sequelize.FLOAT,
         },
         vacaciones: {
            type: Sequelize.FLOAT,
         },
         gratificacion: {
            type: Sequelize.FLOAT,
         },
         cts: {
            type: Sequelize.FLOAT,
         },
         h_extras_primera_quincena: {
            type: Sequelize.FLOAT,
         },
         h_extras_segunda_quincena: {
            type: Sequelize.FLOAT,
         },
         faltas_primera_quincena: {
            type: Sequelize.FLOAT,
         },
         faltas_segunda_quincena: {
            type: Sequelize.FLOAT,
         },
         tardanza_primera_quincena: {
            type: Sequelize.FLOAT,
         },
         tardanza_segunda_quincena: {
            type: Sequelize.FLOAT,
         },
         bono_primera_quincena: {
            type: Sequelize.FLOAT,
         },
         bono_segunda_quincena: {
            type: Sequelize.FLOAT,
         },
         sueldo_bruto: {
            type: Sequelize.FLOAT,
         },
         onp: {
            type: Sequelize.FLOAT,
         },
         eps_primera_quincena: {
            type: Sequelize.FLOAT,
         },
         eps_segunda_quincena: {
            type: Sequelize.FLOAT,
         },
         afp_ap_oblig: {
            type: Sequelize.FLOAT,
         },
         seguro: {
            type: Sequelize.FLOAT,
         },
         comision: {
            type: Sequelize.FLOAT,
         },
         quinta_categoria: {
            type: Sequelize.FLOAT,
         },
         total_descuentos: {
            type: Sequelize.FLOAT,
         },
         sueldo_neto: {
            type: Sequelize.FLOAT,
         },
         sueldo_quincenal: {
            type: Sequelize.FLOAT,
         },
         adelanto_prestamo: {
            type: Sequelize.FLOAT,
         },
         saldo_por_pagar: {
            type: Sequelize.FLOAT,
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
         banco:{
          type:Sequelize.STRING,
          allowNull:false,
        },
        numero_cuenta:{
          type:Sequelize.STRING,
          allowNull:false
        },
        info_detalle:{
          type:Sequelize.JSON,
          allowNull :true
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
         cierre_planilla_mensual_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "cierres_planilla_mensual",
              key: "id",
            },

          },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn("NOW"),
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn("NOW"),
         },
      });
   },

   async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("planilla_mensual");
    await queryInterface.dropTable("cierres_planilla_mensual");
   },
};
