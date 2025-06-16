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
   grupo_tarifa: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: false,
    tableName: "usos",
  });

Uso.associate = (models) => {

  Uso.hasMany(models.cotizaciones_transporte,{
     foreignKey: "uso_id",
  })

  Uso.hasMany(models.cotizaciones,{
     foreignKey: "uso_id",
  })

/*   Uso.hasMany(models.usos,{
     foreignKey: "usoId",
  })

  Uso.hasMany(models.contactos,{
     foreignKey: "contactoId",
  }) */
}

module.exports = { Uso }; // Exporta el modelo para que pueda ser utilizado en otros módulos
