module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      rol_id: {
        type: DataTypes.INTEGER,
        references: { model: "roles", key: "id" },
      },
    },
    {
      tableName: "usuarios",
      timestamps: true,
    }
  );
  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Rol, { foreignKey: "rol_id"});
  };
  return Usuario;
};
