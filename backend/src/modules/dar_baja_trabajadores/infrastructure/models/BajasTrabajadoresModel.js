const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const BajasTrabajadores = sequelize.define(
  "bajas_trabajadores",
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
    contrato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "contratos_laborales",
        key: "id",
      },
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_baja: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    motivo_liquidacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "motivos_liquidacion",
        key: "id",
      },
    },
    observacion: {
      type: DataTypes.TEXT,
    },

    usuario_registro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    estado_liquidacion: {
      type: DataTypes.ENUM("CALCULADA", "PAGADA"),
      allowNull: false,
      defaultValue: "CALCULADA",
    },

    // 💰 Total a pagar (neto)
    total_liquidacion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },

    detalles_liquidacion: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    filial_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Si quieres relación explícita con filiales:
      references: {
        model: "empresas_proveedoras",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  {
    timestamps: true,
    tableName: "bajas_trabajadores",
  }
);

BajasTrabajadores.associate = (models) => {
  BajasTrabajadores.belongsTo(models.trabajadores, {
    foreignKey: "trabajador_id",
    as: "trabajador",
  });

  BajasTrabajadores.belongsTo(models.contratos_laborales, {
    foreignKey: "contrato_id",
    as: "contrato",
  });

  BajasTrabajadores.belongsTo(models.usuarios, {
    foreignKey: "usuario_registro_id",
    as: "registrado_por",
  });

  BajasTrabajadores.belongsTo(models.motivos_liquidacion, {
    foreignKey: "motivo_liquidacion_id",
    as: "motivo_liquidacion",
  });
};

module.exports = { BajasTrabajadores }; // Exporta el modelo para que pueda ser utilizado en otros módulos
