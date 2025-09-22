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
         regimen: {
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
            allowNull: false,
         },
         numero_documento: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         nombres_apellidos: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         area: {
            type: Sequelize.STRING,
            allowNull:false
         },
         afp: {
            type: Sequelize.STRING,
            allowNull:false
         },
         fecha_ingreso: {
            type: Sequelize.DATEONLY,
            allowNull:false
         },
         dias_labor: {
            type: Sequelize.INTEGER,
            allowNull:false
         },
         sueldo_basico: {
            type: Sequelize.FLOAT,
            allowNull: false,
         },
         sueldo_del_mes: {
            type: Sequelize.FLOAT,
            allowNull: false,
         },
         asig_fam: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         descanso_medico: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         licencia_con_goce_de_haber: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         licencia_sin_goce_de_haber: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         vacaciones: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         vacaciones_vendidas: {
             type: Sequelize.FLOAT,
             defaultValue: 0,
         },
         gratificacion: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         cts: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         h_extras_primera_quincena: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         h_extras_segunda_quincena: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         faltas_primera_quincena: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         faltas_segunda_quincena: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         tardanza_primera_quincena: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         tardanza_segunda_quincena: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         bono_primera_quincena: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         bono_segunda_quincena: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         sueldo_bruto: {
            type: Sequelize.FLOAT,
            allowNull:false
         },
         onp: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         afp_ap_oblig: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         seguro: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         comision: {
            type: Sequelize.FLOAT,
         },
         quinta_categoria: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         total_descuentos: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         sueldo_neto: {
            type: Sequelize.FLOAT,
            allowNull:false
         },
         sueldo_quincenal: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         adelanto_prestamo: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         saldo_por_pagar: {
            type: Sequelize.FLOAT,
            allowNull:false
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
          defaultValue: "mo asignado",
        },
        numero_cuenta:{
          type:Sequelize.STRING,
          allowNull:false
        },
        essalud: {
            type: Sequelize.FLOAT,
            defaultValue:0
         },
         seguro_vida_ley: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         sctr_salud: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
         sctr_pension: {
            type: Sequelize.FLOAT,
            defaultValue: 0,
         },
        info_detalle:{
          type:Sequelize.JSON,
          allowNull :true
        },
        locked_at: {
            type: Sequelize.DATE,
            allowNull: false,
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
