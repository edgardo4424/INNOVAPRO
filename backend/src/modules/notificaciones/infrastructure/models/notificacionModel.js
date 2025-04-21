const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Notificaciones = sequelize.define(
  "notificaciones",
  {
    titulo: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    mensaje: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    tipo: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    usuario_id: { 
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
    foreignKey: "usuario_id",
    as: "usuario",
  });
};

module.exports = { Notificaciones }; 