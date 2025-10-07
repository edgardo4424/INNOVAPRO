module.exports = (sequelize, DataTypes) => {
    return sequelize.define("cliente_obras", {
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      obra_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      timestamps: false,
      tableName: "cliente_obras"
    });
  };  