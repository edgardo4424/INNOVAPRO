const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Uso = sequelize.define(
  "usos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
  }, {
    timestamps: false,
    tableName: "usos",
  });

  Uso.associate = (models) => {
    /* Uso.hasMany(models.piezas_usos, {
      foreignKey: "uso_id",
  }); */
}

module.exports = { Uso }; // Exporta el modelo para que pueda ser utilizado en otros módulos
