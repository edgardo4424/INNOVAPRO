
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
                onDelete: "CASCADE",
            },
            producto_servicio_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "productos_servicios",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            cantidad: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false,
                defaultValue: 1.00,
            },
            precio_unitario: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false,
            },
            subtotal: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false,
            },
            descuento: {
                type: DataTypes.DECIMAL(10,2),
                defaultValue: 0.00,
            },
            total: {
                type: DataTypes.DECIMAL(10,2),
                allowNull: false,
            },
            parametros: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        }, {
            timestamps: false,
            tableName: "cotizacion_detalles",
        }
    );

    return cotizacion_detalles;
};