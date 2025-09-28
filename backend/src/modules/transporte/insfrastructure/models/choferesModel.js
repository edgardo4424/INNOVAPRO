const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Choferes = sequelize.define(
    "choferes",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombres: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        apellidos: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        nro_licencia: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        nro_documento: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        tipo_documento: {
            type: DataTypes.STRING(3),
            allowNull: false,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,        },
    },
    {
        timestamps: false,
        tableName: "choferes",
    }
);

Choferes.associate = (models) => {
}

module.exports = { Choferes };
