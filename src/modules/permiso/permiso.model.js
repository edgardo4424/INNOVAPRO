module.exports = (sequelize, DataTypes) => {
  const Permiso = sequelize.define(
    "Permiso",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
      codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
      descripcion: { type: DataTypes.TEXT },
      modulo_id: {
        type: DataTypes.INTEGER,
        references: { model: "modulos", key: "id" },
      },
    },
    {
      tableName: "permisos",
      timestamps: false,
    }
  );

  Permiso.associate = (models) => {
    Permiso.belongsTo(models.Modulo, { foreignKey: "modulo_id"});
  };
  return Permiso;
};
