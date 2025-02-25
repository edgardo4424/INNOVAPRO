module.exports = (sequelize, DataTypes) => {
    const contacto_obras = sequelize.define(
        "contacto_obras",
        {
            contacto_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            obra_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        },
        { timestamps: false, tableName: "contacto_obras" }
    );

    contacto_obras.associate = (models) => {
        contacto_obras.belongsTo(models.contactos, { foreignKey: "contacto_id", as: "contacto" });
        contacto_obras.belongsTo(models.obras, { foreignKey: "obra_id", as: "obra" });
    };

    return contacto_obras;
};