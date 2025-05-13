const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Atributo = sequelize.define(
  "atributos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "uso_id", key: "id" },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    llave_json: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo_dato: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unidad_medida: {
      type: DataTypes.STRING,
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
  },
  {
    timestamps: false,
    tableName: "atributos",
  }
);

Atributo.associate = (models) => {
  Atributo.belongsTo(models.usos, {
    foreignKey: "uso_id",
    as: "uso",
  });
};

module.exports = { Atributo }; // Exporta el modelo para que pueda ser utilizado en otros módulos
