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
            telefono: {
                type: DataTypes.STRING,
            },
            cargo: {
                type: DataTypes.STRING,
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
        },
        {
            timestamps: false,
            tableName: "contactos",
        }
    );

    return Contacto;
};
