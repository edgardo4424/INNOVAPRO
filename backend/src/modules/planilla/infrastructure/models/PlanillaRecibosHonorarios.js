const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const PlanillaMensualReciboHonorario = sequelize.define(
  "planilla_mensual_recibo_honorario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    planilla_mensual_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "planilla_mensual",
        key: "id",
      },
    },
    recibo_por_honorarios_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "recibos_por_honorarios",
        key: "id",
      },
      unique: true, // ✅ Un recibo no puede repetirse en otra fila
    },
  },
  {
    tableName: "planilla_mensual_recibo_honorario",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["planilla_mensual_id", "recibo_por_honorarios_id"],
      },
    ],
  }
);

PlanillaMensualReciboHonorario.associate = (models) => {
  PlanillaMensualReciboHonorario.belongsTo(models.planilla_mensual, {
    foreignKey: "planilla_mensual_id",
    as: "planilla_mensual",
  });

  PlanillaMensualReciboHonorario.belongsTo(models.recibos_por_honorarios, {
    foreignKey: "recibo_por_honorarios_id",
    as: "recibo_por_honorario",
  });
};

module.exports = { PlanillaMensualReciboHonorario };
