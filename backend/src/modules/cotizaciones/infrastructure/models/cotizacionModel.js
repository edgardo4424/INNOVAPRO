const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Asegúrate de importar correctamente tu instancia de Sequelize

const Cotizacion = sequelize.define(
  "cotizaciones",
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
    contacto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "contactos",
        key: "id",
      },
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clientes",
        key: "id",
      },
    },
    obra_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "obras",
        key: "id",
      },
    },
    filial_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "empresas_proveedoras",
        key: "id",
      },
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },

    estados_cotizacion_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "estados_cotizacion",
        key: "id",
      },
    },

    tipo_cotizacion: {
      type: DataTypes.ENUM(
        "Alquiler", 
        "Venta",
      ),
      allowNull: false,
    },
    tiene_transporte: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tiene_instalacion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tiempo_alquiler_dias: {
      type: DataTypes.INTEGER,
    },
    codigo_documento: {
       type: DataTypes.STRING,
       allowNull: false,
    },

  }, {
    timestamps: true,
    tableName: "cotizaciones",
  });

  Cotizacion.associate = (models) => {
    Cotizacion.belongsTo(models.despieces, {
      foreignKey: "despiece_id",
     /*  as: "despiece", */
  });

  Cotizacion.belongsTo(models.contactos, {
    foreignKey: "contacto_id",
    /* as: "contacto", */
  });

  Cotizacion.belongsTo(models.clientes, {
    foreignKey: "cliente_id",
    /* as: "cliente", */
  });

  Cotizacion.belongsTo(models.obras, {
    foreignKey: "obra_id",
   /*  as: "obra", */
  });

  Cotizacion.belongsTo(models.empresas_proveedoras, {
    foreignKey: "filial_id",
    /* as: "empresa_proveedora", */
  });

  Cotizacion.belongsTo(models.usuarios, {
    foreignKey: "usuario_id",
    /* as: "usuario", */
  });
  Cotizacion.belongsTo(models.estados_cotizacion, {
    foreignKey: "estados_cotizacion_id",
    /* as: "estado_cotizacion", */
  });
  Cotizacion.hasMany(models.cotizaciones_transporte, {
  foreignKey: "cotizacion_id",
});
}

module.exports = { Cotizacion }; // Exporta el modelo para que pueda ser utilizado en otros módulos
