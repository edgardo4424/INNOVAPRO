module.exports = (sequelize, DataTypes) => {
    const contacto_clientes = sequelize.define(
        "contacto_clientes",
        {
            contacto_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            cliente_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        },
        { timestamps: false, tableName: "contacto_clientes" }
    );

    contacto_clientes.associate = (models) => {
        contacto_clientes.belongsTo(models.contactos, { foreignKey: "contacto_id", as: "contacto" });
        contacto_clientes.belongsTo(models.clientes, { foreignKey: "cliente_id", as: "cliente" });
    };

    return contacto_clientes;
};