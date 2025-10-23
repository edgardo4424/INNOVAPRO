const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const CargosSunat = sequelize.define(
  "cargos_sunat",
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
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
  }, {
    timestamps: false,
    tableName: "cargos_sunat",
  });

  CargosSunat.associate = (models) => {
   CargosSunat.hasMany(models.contratos_laborales,{
     foreignKey: "id_cargo_sunat",
  })
}

module.exports = { CargosSunat }; // Exporta el modelo para que pueda ser utilizado en otros módulos
