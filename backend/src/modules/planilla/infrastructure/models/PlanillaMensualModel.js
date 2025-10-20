const { DataTypes } = require("sequelize");
const sequelize = require("../../../../database/sequelize");

const PlanillaMensual = sequelize.define(
   "planilla_mensual",
   {
      id: {
         allowNull: false,
         autoIncrement: true,
         primaryKey: true,
         type: DataTypes.INTEGER,
      },
      trabajador_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "trabajadores",
            key: "id",
         },
      },
      contrato_id: {
         type: DataTypes.INTEGER,
         references: {
            model: "contratos_laborales",
            key: "id",
         },
         allowNull: false,
      },
      tipo_contrato: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      regimen: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      periodo: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      fecha_calculo: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
      tipo_documento: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      numero_documento: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      nombres_apellidos: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      area: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      afp: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      fecha_ingreso: {
         type: DataTypes.DATEONLY,
         allowNull: false,
      },
      dias_labor: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      sueldo_basico: {
         type: DataTypes.FLOAT,
         allowNull: false,
      },
      sueldo_del_mes: {
         type: DataTypes.FLOAT,
         allowNull: false,
      },
      asig_fam: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      descanso_medico: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      licencia_con_goce_de_haber: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      licencia_sin_goce_de_haber: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      vacaciones: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      vacaciones_vendidas: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      gratificacion: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      cts: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      h_extras_primera_quincena: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      h_extras_segunda_quincena: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      faltas_primera_quincena: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      faltas_segunda_quincena: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      tardanza_primera_quincena: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      tardanza_segunda_quincena: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      bono_primera_quincena: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      bono_segunda_quincena: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      bonos_extraordinarios: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      sueldo_bruto: {
         type: DataTypes.FLOAT,
         allowNull:false
      },
      onp: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      afp_ap_oblig: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      seguro: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      comision: {
         type: DataTypes.FLOAT,
      },
      quinta_categoria: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      total_descuentos: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      sueldo_neto: {
         type: DataTypes.FLOAT,
         allowNull:false
      },
      sueldo_quincenal: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      adelanto_prestamo: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      sub_total: {
         type: DataTypes.FLOAT,
         allowNull:false
      },
      saldo_por_pagar: {
         type: DataTypes.FLOAT,
         allowNull:false
      },
      filial_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "empresas_proveedoras",
            key: "id",
         },
      },
      banco: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      numero_cuenta: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      essalud: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      seguro_vida_ley: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      sctr_salud: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      sctr_pension: {
         type: DataTypes.FLOAT,
         defaultValue: 0,
      },
      info_detalle: {
         type: DataTypes.JSON,
         allowNull: true,
      },
      locked_at: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      usuario_cierre_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "usuarios",
            key: "id",
         },
      },
      cierre_planilla_mensual_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "cierres_planilla_mensual",
            key: "id",
         },
      },
      ruc: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      domiciliado: {
         type: DataTypes.BOOLEAN,
         allowNull: false,
         defaultValue: true,
      },
   },
   
   {
      timestamps: true,
      tableName: "planilla_mensual",
   }
);

PlanillaMensual.associate = (models) => {
   PlanillaMensual.belongsTo(models.contratos_laborales, {
      foreignKey: "contrato_id",
      as: "contrato",
   });
   PlanillaMensual.belongsTo(models.trabajadores, {
      foreignKey: "trabajador_id",
      as: "trabajador",
   });
   PlanillaMensual.belongsTo(models.usuarios, {
      foreignKey: "usuario_cierre_id",
      as: "usuarioCierre",
   });
   PlanillaMensual.belongsTo(models.empresas_proveedoras, {
      foreignKey: "filial_id",
      as: "filial",
   });
   PlanillaMensual.belongsTo(models.cierres_planilla_mensual, {
      foreignKey: "cierre_planilla_mensual_id",
      as: "cierrePlanillaMensual",
   });
   PlanillaMensual.hasOne(models.planilla_mensual_recibo_honorario, {
      foreignKey: 'planilla_mensual_id',
      as: 'recibo'
});
};

module.exports = { PlanillaMensual };
