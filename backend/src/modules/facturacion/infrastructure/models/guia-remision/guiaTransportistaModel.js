const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../config/db");

const GuiaTranportista = sequelize.define(
    "guia_transportista",
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
        tipo_Doc: {
            type: DataTypes.STRING
        },
        nro_Doc: {
            type: DataTypes.STRING
        },
        nro_mtc: {
            type: DataTypes.STRING
        },
        razon_Social: {
            type: DataTypes.STRING
        },
    },
    {
        timestamps: false,
        tableName: "guia_transportista",
    }
);

GuiaTranportista.associate = function (models) {
    GuiaTranportista.belongsTo(models.guias_de_remision, {
        foreignKey: "guia_id",
    });
};

module.exports = { GuiaTranportista }