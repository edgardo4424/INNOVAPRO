const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../config/db");

const NotasCreditoDebito = sequelize.define(
    "notas_credito_debito",
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
        estado_Documento: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fecha_Emision: {
            type: DataTypes.DATE,
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
        empresa_Ruc: {
            type: DataTypes.STRING,
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
        monto_Igv: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        total_Impuestos: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        valor_Venta: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        monto_Oper_Gravadas: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        monto_Oper_Exoneradas: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        sub_Total: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        monto_Imp_Venta: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        afectado_Tipo_Doc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        afectado_Num_Doc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        motivo_Cod: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        motivo_Des: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        factura_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "factura",
                key: "id",
            },
        },
        guia_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "guias_de_remision",
                key: "id",
            },
        },
        //! -- Campo de anulacion
        anulacion_Motivo: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        timestamps: false,
        tableName: "notas_credito_debito",
    }
);

NotasCreditoDebito.associate = (models) => {
    NotasCreditoDebito.hasMany(models.legend_nota_cre_deb, {
        foreignKey: "nota_id",
    })
    NotasCreditoDebito.hasMany(models.detalle_nota_cre_deb, {
        foreignKey: "nota_id",
    })
    NotasCreditoDebito.hasMany(models.sunat_respuesta, {
        foreignKey: "nota_id",
    })
    NotasCreditoDebito.belongsTo(models.factura, {
        foreignKey: "factura_id",
    })
    NotasCreditoDebito.belongsTo(models.guias_de_remision, {
        foreignKey: "guia_id",
    })
}

module.exports = { NotasCreditoDebito };
