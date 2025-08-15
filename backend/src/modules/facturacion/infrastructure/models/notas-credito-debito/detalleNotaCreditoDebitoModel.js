const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../config/db");

const DetalleNotaCreditoDebito = sequelize.define(
    "detalle_nota_cre_deb",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nota_id: {
            type: DataTypes.INTEGER,
        },
        unidad: {
            type: DataTypes.STRING(4),
        },
        cantidad: {
            type: DataTypes.DECIMAL(12, 2),
        },
        descripcion: {
            type: DataTypes.TEXT,
        },
        monto_Valor_Unitario: {
            type: DataTypes.DECIMAL(12, 2),
        },
        monto_Base_Igv: {
            type: DataTypes.DECIMAL(12, 2),
        },
        monto_Precio_Unitario: {
            type: DataTypes.DECIMAL(12, 2),
        },
        monto_Valor_Venta: {
            type: DataTypes.DECIMAL(12, 2),
        },
        porcentaje_Igv: {
            type: DataTypes.DECIMAL(12, 2),
        },
        igv: {
            type: DataTypes.DECIMAL(12, 2),
        },
        tip_Afe_Igv: {
            type: DataTypes.STRING(4),
        },
        factor_Icbper: {
            type: DataTypes.DECIMAL(12, 2),
        },
        total_Impuestos: {
            type: DataTypes.DECIMAL(12, 2),
        },
        codigo: {
            type: DataTypes.STRING(20),
        },
        cod_Prod_Sunat: {
            type: DataTypes.STRING(255),
        },
    },
    {
        timestamps: false,
        tableName: "detalle_nota_cre_deb",
    }
);

DetalleNotaCreditoDebito.associate = (models) => {
    DetalleNotaCreditoDebito.belongsTo(models.notas_credito_debito, {
        foreignKey: "nota_id",
    });
}


module.exports = { DetalleNotaCreditoDebito };

