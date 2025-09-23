const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Usuario = sequelize.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_chat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    trabajador_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "trabajadores",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    tableName: "usuarios",
  }
);

Usuario.associate = (models) => {

  Usuario.hasMany(models.cotizaciones, {
    foreignKey: "usuario_id",
  });
  Usuario.hasMany(models.cts, {
    foreignKey: "usuario_cierre_id",
  });
  Usuario.hasMany(models.cierres_cts, {
    foreignKey: "usuario_cierre_id",
  });
  Usuario.hasMany(models.gratificaciones, {
    foreignKey: "usuario_cierre_id",
  });
  Usuario.hasMany(models.cierres_gratificaciones, {
    foreignKey: "usuario_cierre_id",
  });

   Usuario.hasMany(models.planilla_quincenal, {
    foreignKey: "usuario_cierre_id",
  });
  
  Usuario.hasMany(models.cierres_planilla_quincenal, {
    foreignKey: "usuario_cierre_id",
  });

  Usuario.hasMany(models.bajas_trabajadores, {
    foreignKey: "usuario_registro_id",
  })

   // Un usuario pertenece a un trabajador
  Usuario.belongsTo(models.trabajadores, {
    foreignKey: "trabajador_id",
    as: "trabajador", // alias para acceder al trabajador desde usuario
  });
  
};

module.exports = { Usuario }; // Exporta el modelo para que pueda ser utilizado en otros módulos
