const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const SoporteMultiInternoDetalleModel = sequelize.define("SoporteMultiInternoDetalle", {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },

  quinta_calculo_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

  remu_multi_json:  { type: DataTypes.JSON, allowNull: false },
  grati_multi_json: { type: DataTypes.JSON, allowNull: false },
  af_multi_json:    { type: DataTypes.JSON, allowNull: false },

  total_ingresos: { type: DataTypes.DECIMAL(14,2), allowNull: false, defaultValue: 0 },
}, {
  tableName: "soporte_multi_interno_detalles",
  timestamps: true,
  underscored: true,
});

module.exports = SoporteMultiInternoDetalleModel;