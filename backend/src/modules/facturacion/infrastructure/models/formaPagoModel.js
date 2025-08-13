const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const FormaPagoFactura = sequelize.define(
    "forma_pago_factura",
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
        tableName: "forma_pago_factura",
    }
);

FormaPagoFactura.associate = (models) => {
    FormaPagoFactura.belongsTo(models.factura, {
        foreignKey: "factura_id",
    });
};

module.exports = { FormaPagoFactura };