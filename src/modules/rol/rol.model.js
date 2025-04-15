module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define(
    "Rol",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
      descripcion: { type: DataTypes.TEXT },
    },
    {
      tableName: "roles",
      timestamps: true,
    }
  );
  Rol.associate = (models) => {
    Rol.hasMany(models.Usuario, { foreignKey: "rol_id" });
    Rol.belongsToMany(models.Permiso, {
      through: "rol_permisos",
      foreignKey: "rol_id",
      otherKey: "permiso_id",
    });
  };
  return Rol;
};
