const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../config/db");

const Borrador = sequelize.define(
    "borradores",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tipo_borrador: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        serie: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        correlativo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        empresa_ruc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cliente_num_doc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cliente_razon_social: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fecha_Emision: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "usuarios",
                key: "id",
            },
        }
    },
    {
        timestamps: false,
        tableName: "borradores",
    }
);

module.exports = { Borrador };