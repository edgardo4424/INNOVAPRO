const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const AtributosValor = sequelize.define(
  "atributos_valor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    despiece_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "despieces",
        key: "id",
      },
    },
    atributo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "atributos",
        key: "id",
      },
    },
    valor: {
      type: DataTypes.STRING,
    },
    numero_formulario_uso: {
      type: DataTypes.INTEGER,
    },
    zona: {
      type: DataTypes.INTEGER
    },
    nota_zona: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    tableName: "atributos_valor",
  });

  AtributosValor.associate = (models) => {
    AtributosValor.belongsTo(models.atributos, {
      foreignKey: "atributo_id",
      as: "atributo",
    });
    AtributosValor.belongsTo(models.despieces, {
      foreignKey: "despiece_id",
      as: "despiece",
    });
  };

module.exports = { AtributosValor }; // Exporta el modelo para que pueda ser utilizado en otros módulos
