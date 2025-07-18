const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Ubigeo = sequelize.define("ubigeos", {
  codigo: {
    type: DataTypes.STRING(6),
    allowNull: false,
    primaryKey: true,
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provincia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  distrito: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  extra_camioneta_soles: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
  },
  extra_camion_soles: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
  },
}, {
  tableName: "ubigeos",
  timestamps: false,
});

module.exports = { Ubigeo };