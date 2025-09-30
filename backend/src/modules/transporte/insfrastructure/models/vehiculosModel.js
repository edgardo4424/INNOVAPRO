const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Vehiculos = sequelize.define(
    "vehiculos",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nro_placa: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        marca: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        tuce_certificado: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        id_transportista: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "transportistas",
                key: "id",
            },
        },
        id_chofer: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "choferes",
                key: "id",
            },
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
        tableName: "vehiculos",
    }
);

Vehiculos.associate = (models) => {
    Vehiculos.belongsTo(models.transportistas, { foreignKey: "id_transportista" });
    Vehiculos.belongsTo(models.choferes, { foreignKey: "id_chofer" });
}


module.exports = { Vehiculos }