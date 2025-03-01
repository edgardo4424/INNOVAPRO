module.exports = (sequelize, DataTypes) => {
    const Contacto = sequelize.define(
        "contactos",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            telefono: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cargo: {
                type: DataTypes.STRING,
                allowNull: true,
            },     
        },
        {
            timestamps: false,
            tableName: "contactos",
        }
    );

    Contacto.associate = (models) => {
        Contacto.belongsToMany(models.clientes, {
            through: "contacto_clientes",
            foreignKey: "contacto_id",
            otherKey: "cliente_id",
            as: "clientes_asociados",
        });

        Contacto.belongsToMany(models.obras, {
            through: "contacto_obras",
            foreignKey: "contacto_id",
            otherKey: "obra_id",
            as: "obras_asociadas",
        });
    };

    return Contacto;
};