module.exports = (sequelize, DataTypes) => {
    const clientes = sequelize.define(
        "clientes",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            razon_social: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            tipo:{
                type: DataTypes.ENUM('Empresa','Particular'),
                allowNull: false,
            },
            ruc: {
                type: DataTypes.STRING(11),
                unique: true,
                allowNull: false,
            },
            dni: {
                type: DataTypes.STRING,
                unique: true,
            },
            telefono:{
                type: DataTypes.STRING,
            },
            email:{
                type: DataTypes.STRING(255),
                unique: true,
            },
            domicilio_fiscal: {
                type: DataTypes.STRING,
            },
            representante_legal: {
                type: DataTypes.STRING,
            },
            dni_representante: {
                type: DataTypes.STRING(8),
            },
            creado_por: {
                type: DataTypes.INTEGER,
            },
            fecha_creacion: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            timestamps: false,
            tableName: "clientes",
        }
    );

    return clientes;
};
