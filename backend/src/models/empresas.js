module.exports = (sequelize, DataTypes) => {
    const empresas_proveedoras = sequelize.define(
        "empresas_proveedoras",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            razon_social: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            ruc: {
                type: DataTypes.STRING(11),
                unique: true,
                allowNull: false,
            },
            direccion: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            representante_legal: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dni_representante: {
                type: DataTypes.STRING(8),
                allowNull: false,
            },
            cargo_representante: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            telefono_representante: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            telefono_oficina: { 
                type: DataTypes.STRING, 
                allowNull: true 
            },
            creado_por: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            timestamps: false,
            tableName: "empresas_proveedoras",
        }
    );

    return empresas_proveedoras;
};
