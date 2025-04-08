module.exports = (sequelize, DataTypes) => {
    const EmpresaProducto = sequelize.define('EmpresaProducto', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'empresas_proveedoras',
          key: 'id'
        }
      },
      producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'productos_servicios',
          key: 'id'
        }
      }
    }, {
      timestamps: false,
      tableName: 'empresa_producto'
    });
  
    return EmpresaProducto;
  };  