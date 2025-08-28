const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const CierreCTS = sequelize.define(
   "cierres_cts",
   {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      filial_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "empresas_proveedoras",
            key: "id",
         },
      },
      periodo: {
         type: DataTypes.STRING(7),
         allowNull: false,
         comment: "Formato: YYYY-MM",
      },
      locked_at: {
         type: DataTypes.DATE,
         allowNull:true,
      },
      usuario_cierre_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "usuarios",
            key: "id",
         },
      },
   },
   {
      timestamps: true,
      tableName: "cierres_cts",
   }
);

CierreCTS.associate = (models) => {
   CierreCTS.hasMany(models.cts, {
      foreignKey: "cierre_id",
   });
   CierreCTS.belongsTo(models.usuarios, {
      foreignKey: "usuario_cierre_id",
      as: "usuarioCierre",
   });
};

module.exports = { CierreCTS };
