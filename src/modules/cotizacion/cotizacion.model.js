module.exports = (sequelize, DataTypes) => {
    const Cotizacion = sequelize.define('Cotizacion', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      descripcion: { type: DataTypes.STRING, allowNull: false },
      clienteId: {
        type: DataTypes.INTEGER,
        references: { model: 'clientes', key: 'id' },
        allowNull: false
      }
    }, {
      tableName: 'cotizaciones',
      timestamps: false
    });
  
    Cotizacion.associate = (models) => {
      Cotizacion.belongsTo(models.Cliente, { foreignKey: 'clienteId' });
    };
  
    return Cotizacion;
  };
  