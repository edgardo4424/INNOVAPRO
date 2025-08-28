const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Cts = sequelize.define(
   "cts",
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
      contratos: {
         type: DataTypes.JSON,
         allowNull: false,
      },
      periodo: {
         type: DataTypes.STRING(7),
         allowNull: false,
      },
      regimen: {
         type: DataTypes.ENUM("GENERAL", "MYPE"),
         allowNull: false,
      },
      sueldo_base: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      asignacion_familiar: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
         defaultValue: 0.0,
      },
      promedio_horas_extras: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
         defaultValue: 0.0,
      },
      promedio_bono_obra: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
         defaultValue: 0.0,
      },
      remuneracion_computable: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      ultima_gratificacion: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      sexto_gratificacion: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },

      meses_computables: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      dias_computables: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      cts_meses: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      cts_dias: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      faltas_dias: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      faltas_importe: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      no_computable: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      cts_depositar: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
      },
      numero_cuenta: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      banco: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      locked_at: {
         type: DataTypes.DATE,
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
         allowNull: true,
         references: {
            model: "cierres_cts",
            key: "id",
         },
      },
   },
   {
      timestamps: true,
      tableName: "cts",
   }
);

Cts.associate = (models) => {
   Cts.belongsTo(models.trabajadores, {
      foreignKey: "trabajador_id",
      as: "trabajadores",
   });

   Cts.belongsTo(models.usuarios, {
      foreignKey: "usuario_cierre_id",
      as: "usuarioCierre",
   });

   Cts.belongsTo(models.empresas_proveedoras, {
      foreignKey: "filial_id",
      as: "filial",
   });
   Cts.belongsTo(models.cierres_cts, {
      foreignKey: "cierre_id",
      as: "cierreCts",
   });
};

module.exports = { Cts };
