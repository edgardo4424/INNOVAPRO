const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../config/db");
const GuiaChoferes = sequelize.define(
    "guia_choferes",
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
            type: DataTypes.STRING,
            allowNull: true,
        },
        nro_Doc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nombres: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        licencia: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        apellidos: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nro_mtc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        razon_Social: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: "guia_choferes",
    }
)

GuiaChoferes.associate = (models) => {
    GuiaChoferes.belongsTo(models.guias_de_remision, {
        foreignKey: "guia_id",
    });
}

module.exports = { GuiaChoferes }
