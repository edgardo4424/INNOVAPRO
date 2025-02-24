module.exports = (sequelize, DataTypes) => {
    const cotizaciones = sequelize.define(
        "cotizaciones",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            codigo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            empresa_proveedora_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "empresas_proveedoras",
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
            contacto_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "contactos",
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
            motivo: {
                type: DataTypes.ENUM("ALQUILER", "VENTA"),
                allowNull: false,
                defaultValue: "ALQUILER",
            },
            fecha_creacion: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            estado: {
                type: DataTypes.ENUM("Borrador", "Enviada", "Aprobada", "Rechazada"),
                defaultValue: "Borrador",
            },
            observaciones: {
                type: DataTypes.TEXT,
            },
        },
        {
            timestamps: false,
            tableName: "cotizaciones",
        }
    );

    return cotizaciones;
};
