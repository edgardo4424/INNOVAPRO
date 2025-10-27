const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const CondicionAlquiler = sequelize.define("condiciones_alquiler", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  contrato_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "contratos",
      key: "id",
    },
  },
  comentario_solicitud: {
    type: DataTypes.TEXT,
  },
  condiciones: {
    type: DataTypes.TEXT, 
  },
  estado: {
    type: DataTypes.ENUM("PENDIENTE", "DEFINIDAS", "CUMPLIDAS"),
    defaultValue: "PENDIENTE",
  },
  condiciones_cumplidas: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
        const raw = this.getDataValue("condiciones_cumplidas");
        return raw ? JSON.parse(raw) : [];
    },
    set(value) {
        this.setDataValue("condiciones_cumplidas", JSON.stringify(value));
    }
  },
  creado_por: {
    type: DataTypes.INTEGER,
  },
  actualizado_por: {
    type: DataTypes.INTEGER,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "condiciones_alquiler",
  timestamps: true,
  underscored: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

CondicionAlquiler.associate = (models) => {
  CondicionAlquiler.belongsTo(models.contratos, {
    foreignKey: "contrato_id",
    as: "contrato_relacionado",
  });
};

module.exports =  CondicionAlquiler ;