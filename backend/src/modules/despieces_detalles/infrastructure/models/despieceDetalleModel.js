const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const DespieceDetalle = sequelize.define(
  "despieces_detalle",
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
    pieza_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "piezas",
        key: "id",
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    peso_kg: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    precio_venta_dolares: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    precio_venta_soles: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    precio_alquiler_soles: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
/*     uuid: {
    type: DataTypes.STRING,
    allowNull: true, // solo aplica a piezas adicionales
    }, */
  },
  {
    timestamps: false,
    tableName: "despieces_detalle",
  }
);

DespieceDetalle.associate = (models) => {
  DespieceDetalle.belongsTo(models.despieces, {
    foreignKey: "despiece_id",
    as: "despiece",
  });
  DespieceDetalle.belongsTo(models.piezas, {
    foreignKey: "pieza_id",
    as: "pieza",
  });
};

module.exports = { DespieceDetalle }; // Exporta el modelo para que pueda ser utilizado en otros módulos
