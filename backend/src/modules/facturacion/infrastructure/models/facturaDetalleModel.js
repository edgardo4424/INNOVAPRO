const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const FacturaDetalle = sequelize.define(
    "factura_detalles",
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
        unidad: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cod_Producto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        monto_Valor_Unitario: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        monto_Base_Igv: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        porcentaje_Igv: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        igv: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        tip_Afe_Igv: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_Impuestos: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        monto_Precio_Unitario: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        monto_Valor_Venta: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        factor_Icbper: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "factura_detalles",
    }
);

FacturaDetalle.associations = (models) => {
    FacturaDetalle.belongsTo(models.facturas, {
        foreignKey: "factura_id",
    });

};

module.exports = { FacturaDetalle };
