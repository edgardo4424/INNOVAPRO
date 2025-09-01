const sequelize = require("../../../../config/db");
const { DataTypes } = require("sequelize");

const Ubigeo = sequelize.define(
    "ubigeos",
    {
        codigo: {
            type: DataTypes.STRING(6),
            primaryKey: true,
        },
        departamento: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        provincia: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        distrito: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        extra_camioneta_soles: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        extra_camion_soles: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: "ubigeos",
    }
);

Ubigeo.associate = (models) => { };
module.exports = { Ubigeo };
