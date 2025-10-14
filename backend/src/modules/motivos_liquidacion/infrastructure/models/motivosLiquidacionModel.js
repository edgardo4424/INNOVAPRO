const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const MotivosLiquidacion = sequelize.define(
  "motivos_liquidacion",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion_larga: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion_corta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: "motivos_liquidacion",
  });

  MotivosLiquidacion.associate = (models) => {
   MotivosLiquidacion.hasMany(models.bajas_trabajadores,{
     foreignKey: "motivo_liquidacion_id",
  })
}

module.exports = { MotivosLiquidacion }; // Exporta el modelo para que pueda ser utilizado en otros módulos
