module.exports = (sequelize, DataTypes) => {
    const Modulo = sequelize.define('Modulo', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
      url: { type: DataTypes.STRING},
      icono: { type: DataTypes.STRING}
    }, {
      tableName: 'modulos',
      timestamps: false
    });
    Modulo.associate = (models) => {
      Modulo.hasMany(models.Permiso, { foreignKey: "modulo_id" });
    };
    return Modulo;
  };
  