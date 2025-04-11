module.exports = (sequelize, DataTypes) => {
    return sequelize.define('rol_modulos', {
      rolId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'roles', key: 'id' }
      },
      moduloId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'modulos', key: 'id' }
      }
    }, {
      tableName: 'rol_modulos',
      timestamps: false
    });
  };
  