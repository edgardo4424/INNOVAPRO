
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
                onDelete: "CASCADE",
            },
            contacto_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "contactos",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            usuario_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "usuarios",
                    key: "id",
                },
                onDelete: "CASCADE",
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
            motivo: {
                type: DataTypes.ENUM("ALQUILER", "VENTA"),
                allowNull: false,
                defaultValue: "ALQUILER",
            },
            descuento_aprobado: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            total_sin_descuento: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            total_con_descuento: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
        },
        {
            timestamps: false,
            tableName: "cotizaciones",
        }
    );

    cotizaciones.associate = (models) => {
        cotizaciones.belongsTo(models.empresas_proveedoras, { 
            foreignKey: "empresa_proveedora_id", 
            as: "empresa_proveedora" 
        });
        cotizaciones.belongsTo(models.contactos, { 
            foreignKey: "contacto_id", 
            as: "contacto" 
        });
        cotizaciones.belongsTo(models.usuarios, { 
            foreignKey: "usuario_id", 
            as: "usuario" 
        });
    };     

    return cotizaciones;
};