const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const EstadosCotizacion = sequelize.define(
  "estados_cotizacion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
    tableName: "estados_cotizacion",
  }
);

EstadosCotizacion.associate = (models) => {
  EstadosCotizacion.hasMany(models.cotizaciones, {
    foreignKey: "estados_cotizacion_id",
});
};

module.exports = { EstadosCotizacion }; // Exporta el modelo para que pueda ser utilizado en otros módulos
