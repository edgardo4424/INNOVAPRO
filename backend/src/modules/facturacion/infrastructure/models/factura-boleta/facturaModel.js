const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../config/db");

const Factura = sequelize.define(
    "factura",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tipo_Operacion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tipo_Doc: {
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
        tipo_Moneda: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fecha_Emision: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        empresa_Ruc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        relDocs: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        extraDetails: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cliente_Tipo_Doc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cliente_Num_Doc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cliente_Razon_Social: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cliente_Direccion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        monto_Oper_Gravadas: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        monto_Oper_Exoneradas: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        monto_Igv: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        total_Impuestos: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        valor_Venta: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        sub_Total: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        monto_Imp_Venta: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        estado_Documento: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        estado: {
            type: DataTypes.ENUM(
                "EMITIDA",
                "RECHAZADA",
                "ANULADA-NOTA",
                "MODIFICADA-NOTA",
                "ANULADA",
                "OBSERVADA",
                "PENDIENTE",
            ),
            allowNull: true,
        },
        Observacion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        manual: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        id_Base_Dato: {
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
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        detraccion_mount: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        //! -- Campos para retenciones (Descuentos)
        descuento_cod_tipo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        descuento_monto_base: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        descuento_factor: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        descuento_monto: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        //! -- Campo de anulacion
        anulacion_Motivo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        orden_compra: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dias_pagar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fecha_vencimiento: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        neto_Pagar: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
        },
        cuotas_Real: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        precio_dolar: {
            type: DataTypes.DECIMAL(12, 6),
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        timestamps: false,
        tableName: "factura",
    }
);

Factura.associate = (models) => {
    Factura.belongsTo(models.usuarios, {
        foreignKey: "usuario_id",
    })
    Factura.hasMany(models.detalle_factura, {
        foreignKey: "factura_id",
    });
    Factura.hasMany(models.forma_pago_factura, {
        foreignKey: "factura_id",
    })
    Factura.hasMany(models.legend_factura, {
        foreignKey: "factura_id",
    })
    Factura.hasMany(models.sunat_respuesta, {
        foreignKey: "factura_id",
    })
    Factura.hasMany(models.notas_credito_debito, {
        foreignKey: "factura_id",
    });
}

module.exports = { Factura };
