module.exports = (sequelize, DataTypes) => {
    const Rol = sequelize.define('Rol', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: DataTypes.STRING, allowNull: false, unique: true }
    }, {
      tableName: 'roles',
      timestamps: true
    });
    Rol.associate = (models) => {
      Rol.hasMany(models.Usuario, { foreignKey: 'rolId' });
      Rol.belongsToMany(models.Modulo, {
        through: 'rol_modulos',
        foreignKey: 'rolId',
        otherKey: 'moduloId'
      });
    };
    return Rol;
  };
  