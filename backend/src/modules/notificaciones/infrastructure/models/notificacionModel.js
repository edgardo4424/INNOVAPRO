const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Notificaciones = sequelize.define(
  "notificaciones",
  {
    mensaje: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    tipo: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    usuarioId: { 
      type: DataTypes.INTEGER, 
      allowNull: false ,
      references: {
        model: "usuarios",
        key: "id",
      }
    },
    leida: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
  }
);

Notificaciones.associate = (models) => {
  Notificaciones.belongsTo(models.usuarios, {
    foreignKey: "usuarioId",
    as: "usuario",
  });
};

module.exports = { Notificaciones }; 