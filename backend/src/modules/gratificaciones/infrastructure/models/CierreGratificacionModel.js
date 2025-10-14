const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const CierreGratificacion = sequelize.define(
   "cierres_gratificaciones",
   {
       id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
      comment: 'Formato: YYYY-MM'
    },
    locked_at: {
      type: DataTypes.DATE,
      comment: 'Fecha de cierre oficial del periodo'
    },
    data_mantenimiento_detalle: {
      type: DataTypes.JSON,
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
      tableName: "cierres_gratificaciones",
       indexes: [
      {
        unique: true,
        fields: ['filial_id', 'periodo'],
        name: 'uniq_filial_periodo'
      }
    ]
   }
);

CierreGratificacion.associate = (models) => {
    CierreGratificacion.hasMany(models.gratificaciones, {
        foreignKey: 'cierre_id',
      });
};

module.exports = { CierreGratificacion }; // Exporta el modelo para que pueda ser utilizado en otros módulos
