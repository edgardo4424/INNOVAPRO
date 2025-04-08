module.exports = (sequelize, DataTypes) => {
    const ProductoServicio = sequelize.define('ProductoServicio', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tipo: {
        type: DataTypes.ENUM('Equipo', 'Servicio'), // Agregamos los valores correctos
        allowNull: false
      },
      atributos: {
        type: DataTypes.JSON, // Aquí se almacenarán los datos específicos según el tipo
        allowNull: true
      }
    }, {
      timestamps: true,
      tableName: 'productos_servicios'
    });
  
    // Relación con Empresas Proveedoras (M:N)
    ProductoServicio.associate = (models) => {
      ProductoServicio.belongsToMany(models.empresas_proveedoras, {
        through: models.EmpresaProducto,
        foreignKey: 'producto_id',
        otherKey: 'empresa_id',
        as: 'empresas'
      });
    };
  
    return ProductoServicio;
  };  