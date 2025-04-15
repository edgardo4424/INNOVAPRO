module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define(
    "Cliente",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      razon_social: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      tipo: {
        type: DataTypes.ENUM("Persona Jurídica", "Persona Natural"),
        allowNull: false,
      },
      ruc: {
        type: DataTypes.STRING(11),
        unique: true,
        allowNull: true,
      },
      dni: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
      },
      domicilio_fiscal: {
        type: DataTypes.STRING,
      },
      representante_legal: {
        type: DataTypes.STRING,
      },
      dni_representante: {
        type: DataTypes.STRING(8),
      },
      creado_por: {
        type: DataTypes.INTEGER,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      tableName: "clientes",
    }
  );

  Cliente.associate = (models) => {
    Cliente.belongsToMany(models.Contacto, {
      through: "contacto_clientes", //nombre de la tabla intermedia
      foreignKey: "cliente_id", // clave foranea del modelo Clinete en la tabla intermedia
      otherKey: "contacto_id", //Clave foránea del otro modelo (contactos) en la tabla intermedia
      as: "contactos_asociados", //Cuando accedas a los contactos de un cliente, puedes usar este alias
    });
  };

  return Cliente;
};
