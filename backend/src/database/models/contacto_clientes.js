module.exports = (sequelize, DataTypes) => {
    return sequelize.define("contacto_clientes", {
      contacto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      timestamps: false,
      tableName: "contacto_clientes"
    });
  };
  