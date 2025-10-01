const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Transportistas = sequelize.define(
    "transportistas",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nro_doc: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        razon_social: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        nro_mtc: {
            type: DataTypes.STRING(50),
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
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: false,
        tableName: "transportistas",
    }
);

Transportistas.associate = (models) => {
    Transportistas.hasMany(models.vehiculos, { foreignKey: "id_transportista" });
}

module.exports = { Transportistas };
