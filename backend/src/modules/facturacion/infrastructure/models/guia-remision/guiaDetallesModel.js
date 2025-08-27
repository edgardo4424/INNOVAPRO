const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../config/db");

const GuiaDetalles = sequelize.define(
    "guia_detalles",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        guia_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "guias_de_remision",
                key: "id",
            },
        },
        unidad: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cantidad: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        cod_Producto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "guia_detalles",
    }
);

GuiaDetalles.associate = (models) => {
    GuiaDetalles.belongsTo(models.guias_de_remision, {
        foreignKey: "guia_id",
    });
}

module.exports = { GuiaDetalles }
