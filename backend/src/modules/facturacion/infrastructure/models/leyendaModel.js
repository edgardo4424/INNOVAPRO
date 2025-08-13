const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Leyenda = sequelize.define(
    "legend_factura",
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
                model: "factura",
                key: "id",
            },
        },
        legend_Code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        legend_Value: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
    timestamps: false,
    tableName: "legend_factura",
});

Leyenda.associate = (models) => {
    Leyenda.belongsTo(models.factura, {
        foreignKey: "factura_id",
    });
}
module.exports = { Leyenda }