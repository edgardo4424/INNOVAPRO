const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const ContriSUNAT = sequelize.define("contrisunat", {
  ruc: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  nombre_razon_social: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado_contribuyente: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  condicion_domicilio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ubigeo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipo_via: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nombre_via: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  codigo_zona: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipo_zona: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interior: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lote: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  manzana: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kilometro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "contrisunat",
  timestamps: false,
});

ContriSUNAT.associate = (models) => {
  ContriSUNAT.belongsTo(models.ubigeos, {
    foreignKey: "ubigeo",
    targetKey: "codigo",
    as: "ubigeo_info",
  });
};

module.exports = { ContriSUNAT };