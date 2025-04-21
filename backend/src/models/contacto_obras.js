module.exports = (sequelize, DataTypes) => {
    return sequelize.define("contacto_obras", {
      contacto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      obra_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      timestamps: false,
      tableName: "contacto_obras"
    });
  };  