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
      },
      numero_documento: {
         type: DataTypes.STRING,
      },
      nombres_apellidos: {
         type: DataTypes.STRING,
      },
      area: {
         type: DataTypes.STRING,
      },
      afp: {
         type: DataTypes.STRING,
      },
      fecha_ingreso: {
         type: DataTypes.DATE,
      },
      dias_labor: {
         type: DataTypes.INTEGER,
      },
      sueldo_basico: {
         type: DataTypes.FLOAT,
      },
      sueldo_del_mes: {
         type: DataTypes.FLOAT,
      },
      asig_fam: {
         type: DataTypes.FLOAT,
      },
      descanso_medico: {
         type: DataTypes.FLOAT,
      },
      licencia_con_goce_de_haber: {
         type: DataTypes.FLOAT,
      },
      licencia_sin_goce_de_haber: {
         type: DataTypes.FLOAT,
      },
      vacaciones: {
         type: DataTypes.FLOAT,
      },
      gratificacion: {
         type: DataTypes.FLOAT,
      },
      cts: {
         type: DataTypes.FLOAT,
      },
      h_extras_primera_quincena: {
         type: DataTypes.FLOAT,
      },
      h_extras_segunda_quincena: {
         type: DataTypes.FLOAT,
      },
      faltas_primera_quincena: {
         type: DataTypes.FLOAT,
      },
      faltas_segunda_quincena: {
         type: DataTypes.FLOAT,
      },
      tardanza_primera_quincena: {
         type: DataTypes.FLOAT,
      },
      tardanza_segunda_quincena: {
         type: DataTypes.FLOAT,
      },
      bono_primera_quincena: {
         type: DataTypes.FLOAT,
      },
      bono_segunda_quincena: {
         type: DataTypes.FLOAT,
      },
      sueldo_bruto: {
         type: DataTypes.FLOAT,
      },
      onp: {
         type: DataTypes.FLOAT,
      },
      eps_primera_quincena: {
         type: DataTypes.FLOAT,
      },
      eps_segunda_quincena: {
         type: DataTypes.FLOAT,
      },
      afp_ap_oblig: {
         type: DataTypes.FLOAT,
      },
      seguro: {
         type: DataTypes.FLOAT,
      },
      comision: {
         type: DataTypes.FLOAT,
      },
      quinta_categoria: {
         type: DataTypes.FLOAT,
      },
      total_descuentos: {
         type: DataTypes.FLOAT,
      },
      sueldo_neto: {
         type: DataTypes.FLOAT,
      },
      sueldo_quincenal: {
         type: DataTypes.FLOAT,
      },
      adelanto_prestamo: {
         type: DataTypes.FLOAT,
      },
      saldo_por_pagar: {
         type: DataTypes.FLOAT,
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
      info_detalle: {
         type: DataTypes.JSON,
         allowNull: true,
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
   },
   {
      timestamps: true,
      tableName: "planilla_mensual",
   }
);

PlanillaMensual.associate=(models)=>{
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
}

module.exports={PlanillaMensual}