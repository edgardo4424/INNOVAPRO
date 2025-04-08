module.exports = (sequelize, DataTypes) => {
  const Notificacion = sequelize.define("notificaciones", {
      usuarioId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "usuarios", key: "id" },
      },
      mensaje: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      tipo: {
          type: DataTypes.STRING, // "tarea_devuelta", "tarea_finalizada", "asignada"
          allowNull: false,
      },
      leida: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
      },
  });

  Notificacion.associate = (models) => {
      Notificacion.belongsTo(models.usuarios, { 
        foreignKey: "usuarioId", 
        as: "usuario" });
  };

  return Notificacion;
};