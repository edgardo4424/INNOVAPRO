const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const ReciboPorHonorario = sequelize.define(
  "recibos_por_honorarios",
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
    tipo_comprobante_emitido: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
    serie_comprobante_emitido: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    numero_comprobante_emitido: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    monto_total_servicio: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    fecha_emision: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fecha_pago: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    indicador_retencion_cuarta_categoria: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
    indicador_retencion_regimen_pensionario: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
    importe_aporte_regimen_pensionario: {
      type: DataTypes.DECIMAL(7, 2),
      allowNull: true,
    },
  },
  {
    tableName: "recibos_por_honorarios",
    timestamps: true,
  }
);

ReciboPorHonorario.associate = (models) => {
  ReciboPorHonorario.belongsTo(models.trabajadores, {
    foreignKey: "trabajador_id",
    as: "trabajador",
  });
    
  ReciboPorHonorario.hasOne(models.planilla_mensual_recibo_honorario, {
      foreignKey: 'recibo_por_honorarios_id',
      as: 'planilla_mensual'
    });
};

module.exports = { ReciboPorHonorario };
