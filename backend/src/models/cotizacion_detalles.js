module.exports = (sequelize, DataTypes) => {
    const cotizacion_detalles = sequelize.define(
        "cotizacion_detalles",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            cotizacion_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "cotizaciones",
                    key: "id",
                },
            },
            servicio: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            cantidad: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            unidad: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            precio_unitario: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        },
        {
            timestamps: false,
            tableName: "cotizacion_detalles",
        }
    );

    return cotizacion_detalles;
};