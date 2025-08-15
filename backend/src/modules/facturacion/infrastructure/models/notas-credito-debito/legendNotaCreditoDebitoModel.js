const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../config/db");

const LegendNotaCreditoDebito = sequelize.define(
    "legend_nota_cre_deb",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nota_id: {
            type: DataTypes.INTEGER,
        },
        legend_Value: {
            type: DataTypes.TEXT,
        },
        legend_Code: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false,
        tableName: "legend_nota_cre_deb",
    }
);

LegendNotaCreditoDebito.associate = (models) => {
    LegendNotaCreditoDebito.belongsTo(models.notas_credito_debito, {
        foreignKey: "nota_id",
    });
}

module.exports = { LegendNotaCreditoDebito };

