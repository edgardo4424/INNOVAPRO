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
        tipo_doc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nro_doc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nombres: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        licencia: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellidos: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nro_mtc: {
            type: DataTypes.STRING,
            allowNull: false,
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
