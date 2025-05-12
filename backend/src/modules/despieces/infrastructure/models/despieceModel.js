const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Despiece = sequelize.define(
  "despieces",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    moneda: {
      type: DataTypes.ENUM(
        "PEN", 
        "USD",
      ),
      allowNull: false,
    },
    
    subtotal: {
      type: DataTypes.DECIMAL(10,2),
      defaultValue: 0
    },
    porcentaje_descuento: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    subtotal_con_descuento: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    igv_porcentaje: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 18,
    },
    igv_monto: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total_final: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    }
  }, {
    timestamps: false,
    tableName: "despieces",
  });

Despiece.associate = (models) => {
  Despiece.hasMany(models.despieces_detalle, {
    foreignKey: "despiece_id",
});

Despiece.hasMany(models.atributos_valor, {
  foreignKey: "despiece_id",
});

}

module.exports = { Despiece }; // Exporta el modelo para que pueda ser utilizado en otros módulos
