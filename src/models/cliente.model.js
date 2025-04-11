module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nombre: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true }
    }, {
      tableName: 'clientes',
      timestamps: false
    });
  
    Cliente.associate = (models) => {
      Cliente.hasMany(models.Cotizacion, { foreignKey: 'clienteId' });
    };
  
    return Cliente;
  };
  