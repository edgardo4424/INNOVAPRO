const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Filial = sequelize.define(
  "empresas_proveedoras",
  {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      razon_social: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
      },
      ruc: {
          type: DataTypes.STRING(11),
          unique: true,
          allowNull: false,
      },
      direccion: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      representante_legal: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      dni_representante: {
          type: DataTypes.STRING(8),
          allowNull: false,
      },
      cargo_representante: {
          type: DataTypes.STRING(100),
          allowNull: false,
      },
      telefono_representante: {
          type: DataTypes.STRING(50),
          allowNull: false,
      },
      telefono_oficina: { 
          type: DataTypes.STRING, 
          allowNull: true 
      },
      creado_por: {
          type: DataTypes.INTEGER,
          allowNull: false,
      }
  },
  {
      timestamps: false,
      tableName: "empresas_proveedoras",
  }
);

Filial.associate = (models) => {
 
  Filial.hasMany(models.cotizaciones, {
    foreignKey: "filial_id",
    
});
};

module.exports = { Filial }; // Exporta el modelo para que pueda ser utilizado en otros módulos
