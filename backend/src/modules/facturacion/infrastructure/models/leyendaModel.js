const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Leyenda = sequelize.define(
    "leyendas",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        factura_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "facturas",
                key: "id",
            },
        },
        legend_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        legend_code: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
    timestamps: false,
    tableName: "leyendas",
});

Leyenda.associate = (models) => {
    Leyenda.belongsTo(models.facturas, {
        foreignKey: "factura_id",
    });
}
module.exports = { Leyenda }