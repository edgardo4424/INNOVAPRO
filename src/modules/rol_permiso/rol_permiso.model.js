module.exports = (sequelize, DataTypes) => {
    const RolPermiso = sequelize.define('RolPermiso', {
      
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      rol_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'roles', key: 'id' }
      },
      permiso_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'permisos', key: 'id' }
      }
    }, {
      tableName: 'rol_permisos',
      timestamps: false
    });

    return RolPermiso
  };
  