module.exports = (sequelize, DataTypes) => {
    const Modulo = sequelize.define('Modulo', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: DataTypes.STRING, allowNull: false, unique: true }
    }, {
      tableName: 'modulos',
      timestamps: false
    });
    Modulo.associate = (models) => {
      Modulo.belongsToMany(models.Rol, {
        through: 'rol_modulos',
        foreignKey: 'moduloId',
        otherKey: 'rolId'
      });
    };
    return Modulo;
  };
  