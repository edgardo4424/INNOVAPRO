module.exports = (sequelize, DataTypes) => {
    const ContriSunat = sequelize.define("contrisunat", {
      ruc: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      nombre_razon_social: DataTypes.STRING,
      estado_contribuyente: DataTypes.STRING,
      condicion_domicilio: DataTypes.STRING,
      ubigeo: DataTypes.STRING,
      tipo_via: DataTypes.STRING,
      nombre_via: DataTypes.STRING,
      codigo_zona: DataTypes.STRING,
      tipo_zona: DataTypes.STRING,
      numero: DataTypes.STRING,
      interior: DataTypes.STRING,
      lote: DataTypes.STRING,
    }, {
      timestamps: false,
      tableName: "contrisunat"
    });
  
    return ContriSunat;
  };  