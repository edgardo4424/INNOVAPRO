module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      rolId: {
        type: DataTypes.INTEGER,
        references: { model: "roles", key: "id" },
      },
    },
    {
      tableName: "usuarios",
      timestamps: false,
    }
  );
  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Rol, { foreignKey: "rolId"});
  };
  return Usuario;
};
