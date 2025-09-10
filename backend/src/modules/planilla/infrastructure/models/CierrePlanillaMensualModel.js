const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const CierresPlanillaMensual = sequelize.define(
   "cierres_planilla_mensual",
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
         comment: "Fecha de cierre oficial del periodo",
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
      tableName: "cierres_planilla_mensual",
   }
);

CierresPlanillaMensual.associate = (models) => {
   CierresPlanillaMensual.hasMany(models.planilla_mensual, {
      foreignKey: "cierre_planilla_mensual_id",
   });
     CierresPlanillaMensual.belongsTo(models.empresas_proveedoras, {
    foreignKey: {
      name: "filial_id",     // nombre lógico en JS
      field: "filial_id",    // nombre físico en la tabla
      allowNull: false,
    },
    as: "filial",
    targetKey: "id",
  });
};

module.exports = { CierresPlanillaMensual }; // Exporta el modelo para que pueda ser utilizado en otros módulos
