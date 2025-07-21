const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Factura = sequelize.define(
    "facturas",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tipo_operacion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tipo_doc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        serie: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        correlativo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tipo_moneda: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fecha_emision: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        empresa_ruc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cliente_tipo_doc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cliente_num_doc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cliente_razon_social: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cliente_direccion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        monto_oper_gravadas: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        monto_oper_exoneradas: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        monto_igv: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        total_impuestos: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        valor_venta: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        sub_total: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        monto_imp_venta: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        estado_documento: {
            type: DataTypes.ENUM(
                "BORRADOR",
                "EMITIDA",
                "RECHAZADA",
                "ANULADA",
                "OBSERVADA"
            ),
            allowNull: true,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        manual: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        id_base_dato: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "usuarios",
                key: "id",
            },
        },
        //! -- Campos para detracción
        detraccion_cod_bien_detraccion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        detraccion_cod_medio_pago: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        detraccion_cta_banco: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        detraccion_percent: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        detraccion_mount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        //! -- Campos para descuento
        descuento_cod_tipo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        descuento_monto_base: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        descuento_factor: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        descuento_monto: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: "facturas",
    }
);

Factura.associate = (models) => {
    Factura.belongsTo(models.usuarios, {
        foreignKey: "usuario_id",
    })
    Factura.hasMany(models.factura_detalles, {
        foreignKey: "factura_id",
    });
    Factura.hasMany(models.formas_pago, {
        foreignKey: "factura_id",
    })
    Factura.hasMany(models.leyendas, {
        foreignKey: "factura_id",
    })
}

module.exports = { Factura };
