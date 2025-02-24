module.exports = (sequelize, DataTypes) => {
    const obras = sequelize.define(
        "obras",
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
            cliente_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "clientes",
                    key: "id",
                },
            },
            contacto_principal_id: {
                type: DataTypes.INTEGER,
            },
            ubicacion: {
                type: DataTypes.ENUM('Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima Metropolitana', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'),
                defaultValue: "Lima Metropolitana",
                allowNull: false,
            },
            direccion: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            estado: {
                type: DataTypes.ENUM('Activo', 'Inactivo', 'En Construcción', 'Finalizado'),
                allowNull: false,
                defaultValue: "En Construcción",
            },
            creado_por: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "usuarios",
                    key: "id",
                },
            },
            fecha_creacion: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            fecha_actualizacion: {
                type: DataTypes.DATE,
            },
        },
        {
            timestamps: false,
            tableName: "obras",
        }
    );

    return obras;
};
