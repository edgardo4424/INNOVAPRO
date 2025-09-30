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
        nro_doc: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        tipo_doc: {
            type: DataTypes.STRING(3),
            allowNull: false,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE,
        },
    },
    {
        timestamps: true,
        tableName: "choferes",
    }
);

Choferes.associate = (models) => {
    Choferes.hasOne(models.vehiculos, { foreignKey: "id_chofer" });
}

module.exports = { Choferes };
