const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Documento = sequelize.define(
  "documentos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contrato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "contratos",
        key: "id",
      },
    },
    estado: {
      type: DataTypes.ENUM("borrador", "actualizado", "oficial"),
      allowNull: false,
      defaultValue: "borrador",
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    docx_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pdf_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "documentos",
    timestamps: true,
  }
);

Documento.associate = (models) => {
  
    Documento.belongsTo(models.contratos, {
        foreignKey: "contrato_id",
        as: "contrato",
    });
};

module.exports = { Documento };
