const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const PlanillaQuincenal = sequelize.define(
  "planilla_quincenal",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    trabajador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "trabajadores",
        key: "id",
      },
    },
    tipo_contrato: {
      type: DataTypes.ENUM("PLANILLA", "HONORARIOS"),
      allowNull: false,
      defaultValue: "PLANILLA",
    },
    periodo: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    fecha_calculo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    regimen: {
      type: DataTypes.ENUM("GENERAL", "MYPE", "MICRO"),
      allowNull: false,
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dias_laborados: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    sueldo_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sueldo_quincenal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    asignacion_familiar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sueldo_bruto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    onp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    afp_oblig: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    seguro: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    comision_afp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quinta_categoria: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    adelanto_sueldo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_descuentos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_pagar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    locked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    banco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_cuenta: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    contrato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "contratos_laborales",
        key: "id",
      },
    },
    usuario_cierre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    filial_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "empresas_proveedoras",
        key: "id",
      },
    },
    cierre_planilla_quincenal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cierres_planilla_quincenal",
        key: "id",
      },
    },
    
    data_mantenimiento_detalle: {
      type: DataTypes.JSON, // guardar la info de data mantenimiento con la cual se hizo el calculo
    },
    info_detalle: {
      type: DataTypes.JSON, // guardar la info adicional de cada registro 
    },
    registro_planilla_quincenal_detalle: { // cuando hay mas de dos contratos (renovaciones) guardar la info de cada contrato en un array
      type: DataTypes.JSON,
    },

    cargo: {
         type: DataTypes.STRING,
         allowNull: false,
      },
    tipo_afp: {
         type: DataTypes.STRING,
         allowNull: false,
      },

  },
  {
    timestamps: true,
    tableName: "planilla_quincenal",
    indexes: [
      {
        unique: true,
        fields: [
          "trabajador_id",
          "periodo",
          "regimen",
          "filial_id",
          "contrato_id",
        ],
        name: "uniq_planilla_quincenal",
      },
    ],
  }
);

PlanillaQuincenal.associate = (models) => {
  PlanillaQuincenal.belongsTo(models.contratos_laborales, {
    foreignKey: "contrato_id",
    as: "contrato",
  });

  PlanillaQuincenal.belongsTo(models.trabajadores, {
    foreignKey: "trabajador_id",
    as: "trabajador",
  });

  PlanillaQuincenal.belongsTo(models.usuarios, {
    foreignKey: "usuario_cierre_id",
    as: "usuarioCierre",
  });

  PlanillaQuincenal.belongsTo(models.empresas_proveedoras, {
    foreignKey: "filial_id",
    as: "filial",
  });

  PlanillaQuincenal.belongsTo(models.cierres_planilla_quincenal, {
    foreignKey: "cierre_planilla_quincenal_id",
    as: "cierrePlanillaQuincenal",
  });
};

module.exports = { PlanillaQuincenal }; // Exporta el modelo para que pueda ser utilizado en otros módulos
