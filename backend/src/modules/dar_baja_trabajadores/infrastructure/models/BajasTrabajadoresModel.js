const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const BajasTrabajadores = sequelize.define(
   "bajas_trabajadores",
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
    contrato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
       references: {
        model: "contratos_laborales",
        key: "id",
      },
    },
     fecha_baja: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    motivo: {
      type: DataTypes.ENUM('RENUNCIA', 'DESPIDO', 'FIN CONTRATO', 'MUTUO ACUERDO'),
      allowNull: false,
      defaultValue: 'FIN CONTRATO'
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
      type: DataTypes.ENUM('CALCULADA', 'PAGADA'),
      allowNull: false,
      defaultValue: 'CALCULADA'
    },
    // Tiempo laborado (sin descontar faltas)
    tiempo_laborado_anios: { type: DataTypes.INTEGER, defaultValue: 0 },
    tiempo_laborado_meses: { type: DataTypes.INTEGER, defaultValue: 0 },
    tiempo_laborado_dias: { type: DataTypes.INTEGER, defaultValue: 0 },

    // Tiempo computado (con faltas/sanciones descontadas)
    tiempo_computado_anios: { type: DataTypes.INTEGER, defaultValue: 0 },
    tiempo_computado_meses: { type: DataTypes.INTEGER, defaultValue: 0 },
    tiempo_computado_dias: { type: DataTypes.INTEGER, defaultValue: 0 },

    // 🟨 Referencias opcionales a cálculos (si los necesitas)
    gratificacion_trunca_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "gratificaciones", key: "id" },
    },
    cts_trunca_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "cts", key: "id" },
    },
    planilla_mensual_trunca_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "planilla_mensual", key: "id" },
    },

    // 🧮 Montos truncos
    cts_trunca_monto: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00 },
    vacaciones_truncas_monto: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00  },
    gratificacion_trunca_monto: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00  },
    remuneracion_trunca_monto: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00  },

    // ➖ Descuentos
    afp_descuento: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00  },
    adelanto_descuento: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00  },
    otros_descuentos: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00  },
    //detalle_otros_descuentos: { type: DataTypes.TEXT, allowNull: true },

    // 💰 Total a pagar (neto)
    total_liquidacion: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00  },

    // 🔍 Detalle remuneración (útil si varían componentes)
    detalle_remuneracion_computable: {
      type: DataTypes.JSON,
      allowNull: true,
      // Ejemplo: { sueldo: 1800, asignacion_familiar: 113, promedio_gratificacion: 91.88 }
    },
  },
   {
      timestamps: true,
      tableName: "bajas_trabajadores",
   }
);

BajasTrabajadores.associate = (models) => {
    BajasTrabajadores.belongsTo(models.trabajadores, {
        foreignKey: 'trabajador_id',
        as: 'trabajador'
      });

      BajasTrabajadores.belongsTo(models.contratos_laborales, {
        foreignKey: 'contrato_id',
        as: 'contrato'
      });

      BajasTrabajadores.belongsTo(models.usuarios, {
        foreignKey: 'usuario_registro_id',
        as: 'registrado_por'
      });
};

module.exports = { BajasTrabajadores }; // Exporta el modelo para que pueda ser utilizado en otros módulos
