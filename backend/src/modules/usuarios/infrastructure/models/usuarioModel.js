const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Usuario = sequelize.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM(
        "Gerencia",
        "Ventas",
        "Oficina Técnica",
        "Almacén",
        "Administración",
        "Clientes"
      ),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "usuarios",
  }
);

module.exports = { Usuario }; // Exporta el modelo para que pueda ser utilizado en otros módulos
