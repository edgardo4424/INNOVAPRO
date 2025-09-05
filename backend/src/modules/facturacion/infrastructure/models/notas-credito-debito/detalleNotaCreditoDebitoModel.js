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
            allowNull: true

        },
        cantidad: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true

        },
        cod_Producto: {
            type: DataTypes.STRING,
            allowNull: true
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true

        },
        monto_Valor_Unitario: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true

        },
        monto_Base_Igv: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true

        },
        monto_Precio_Unitario: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true

        },
        monto_Valor_Venta: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true

        },
        porcentaje_Igv: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true

        },
        igv: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true

        },
        tip_Afe_Igv: {
            type: DataTypes.STRING(4),
            allowNull: true

        },
        factor_Icbper: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true

        },
        total_Impuestos: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true

        },
        codigo: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        cod_Prod_Sunat: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        descuento: {
            type: DataTypes.TEXT,
            allowNull: true
        }
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

