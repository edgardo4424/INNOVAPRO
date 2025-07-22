const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const FormaPago = sequelize.define(
    "formas_pago",
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
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        monto: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        cuota: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fecha_Pago: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "formas_pago",
    }
);

FormaPago.associate = (models) => {
    FormaPago.belongsTo(models.facturas, {
        foreignKey: "factura_id",
    });
};

module.exports = { FormaPago };