const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const CierrePlanillaQuincenal = sequelize.define(
  "cierres_planilla_quincenal",
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
    tableName: "cierres_planilla_quincenal",
    indexes: [
      {
        unique: true,
        fields: ["filial_id", "periodo"],
        name: "uniq_cierre_planilla_quincenal",
      },
    ],
  }
);

CierrePlanillaQuincenal.associate = (models) => {
  CierrePlanillaQuincenal.hasMany(models.planilla_quincenal, {
    foreignKey: "cierre_planilla_quincenal_id",
  });

  CierrePlanillaQuincenal.belongsTo(models.empresas_proveedoras, {
    foreignKey: "filial_id",
    as: "filial",
  });
};

module.exports = { CierrePlanillaQuincenal }; // Exporta el modelo para que pueda ser utilizado en otros módulos
