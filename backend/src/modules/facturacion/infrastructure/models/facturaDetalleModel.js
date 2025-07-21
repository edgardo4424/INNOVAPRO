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
        cod_producto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        monto_valor_unitario: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        monto_base_igv: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        porcentaje_igv: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        igv: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        tip_afe_igv: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_impuestos: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        monto_precio_unitario: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        monto_valor_venta: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        factor_icbper: {
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
