const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Obra = sequelize.define(
  "Obra",
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
    ubicacion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(
        "Planificación",
        "Demolición",
        "Excavación",
        "Cimentación y estructura",
        "Cerramientos y albañilería",
        "Acabados",
        "Entrega y postventa"
      ),
      allowNull: false,
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
    tableName: "obras",
  }
);

module.exports = { Obra }; // Exporta el modelo para que pueda ser utilizado en otros módulos
