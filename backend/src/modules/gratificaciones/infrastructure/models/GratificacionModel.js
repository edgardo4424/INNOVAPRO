const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Gratificacion = sequelize.define(
   "gratificaciones",
   {
       id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
      type: DataTypes.ENUM('PLANILLA', 'HONORARIOS'),
      allowNull: false,
      defaultValue: 'PLANILLA'
    },
    periodo: {
      type: DataTypes.STRING(7),
      allowNull: false
    },
    fecha_calculo: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    regimen: {
      type: DataTypes.ENUM('GENERAL', 'MYPE', 'MICRO'),
      allowNull: false
    },
    factor_regimen: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
      comment: '1.00 general, 0.50 mype, 0.00 micro'
    },
    sueldo_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    asignacion_familiar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    promedio_horas_extras: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    promedio_bono_obra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    remuneracion_computable: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'suma de los 4 componentes'
    },
    meses_computables: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gratificacion_bruta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    faltas_dias: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    faltas_monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    no_computable: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'solo informativo, no entra a RC'
    },
    gratificacion_neta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'grati bruta - faltas'
    },
    /* sistema_salud: {
      type: DataTypes.ENUM('ESSALUD', 'EPS'),
      allowNull: false,
      defaultValue: 'ESSALUD'
    }, */
    bonificacion_extraordinaria: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    renta_5ta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    adelantos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    total_pagar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    locked_at: {
      type: DataTypes.DATE,
      allowNull: true
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
    cierre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
       references: {
        model: "cierres_gratificaciones",
        key: "id",
      },
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
   },
   fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
   },
  },
   {
      timestamps: true,
      tableName: "gratificaciones",
       indexes: [
      {
        unique: true,
        fields: ['trabajador_id', 'periodo', 'regimen', 'filial_id', 'cierre_id, fecha_ingreso, fecha_fin'],
        name: 'uniq_trabajador_periodo_extendido'
      }
    ]
   }
);

Gratificacion.associate = (models) => {
    Gratificacion.belongsTo(models.trabajadores, {
        foreignKey: 'trabajador_id',
        as: 'trabajador'
      });

      Gratificacion.belongsTo(models.usuarios, {
        foreignKey: 'usuario_cierre_id',
        as: 'usuarioCierre'
      });

      Gratificacion.belongsTo(models.empresas_proveedoras, {
        foreignKey: 'filial_id',
        as: 'filial'
      });

      Gratificacion.belongsTo(models.cierres_gratificaciones, {
        foreignKey: 'cierre_id',
        as: 'cierreGratificacion'
      });
};

module.exports = { Gratificacion }; // Exporta el modelo para que pueda ser utilizado en otros módulos
