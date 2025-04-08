module.exports = (sequelize, DataTypes) => {
    const Ubigeo = sequelize.define("ubigeos", {
      codigo: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      departamento: DataTypes.STRING,
      provincia: DataTypes.STRING,
      distrito: DataTypes.STRING
    }, {
      timestamps: false,
      tableName: "ubigeos"
    });
  
    return Ubigeo;
  };