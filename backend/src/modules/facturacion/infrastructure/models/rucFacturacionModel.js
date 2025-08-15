const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const RucFacturacion = sequelize.define(
    "ruc_facturacion",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ruc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        timestamps: false,
        tableName: "ruc_facturacion",
    }
);

RucFacturacion.associate = (models) => {
    RucFacturacion.hasMany(models.factura, {
        foreignKey: "empresa_ruc",
    });
}

module.exports = { RucFacturacion };