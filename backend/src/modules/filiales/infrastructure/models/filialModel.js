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
         allowNull: true,
      },
      creado_por: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      cuenta_banco: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      correo: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      link_website: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      codigo_ubigeo: {
         type: DataTypes.STRING(6),
         allowNull: true,
      },
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
   Filial.hasMany(models.contratos_laborales, {
      foreignKey: "filial_id",
   });
   Filial.hasMany(models.cts, {
      foreignKey: "filial_id",
   });
   Filial.hasMany(models.cierres_planilla_mensual, {
      foreignKey: "filial_id",
   });
};

module.exports = { Filial }; // Exporta el modelo para que pueda ser utilizado en otros módulos
