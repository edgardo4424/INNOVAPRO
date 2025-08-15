const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const SunatRespuesta = sequelize.define(
    "sunat_respuesta",
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
        guia_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "guias_de_remision",
                key: "id",
            },
        },
        nota_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "notas_credito_debito",
                key: "id",
            },
        },
        hash: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        cdr_zip: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        sunat_success: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        cdr_response_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cdr_response_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cdr_response_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
    timestamps: false,
    tableName: "sunat_respuesta",
});

SunatRespuesta.associate = (models) => {
    SunatRespuesta.belongsTo(models.factura, {
        foreignKey: "factura_id",
    });
    SunatRespuesta.belongsTo(models.guias_de_remision, {
        foreignKey: "guia_id",
    });
    SunatRespuesta.belongsTo(models.notas_credito_debito, {
        foreignKey: "nota_id",
    });
};

module.exports = { SunatRespuesta };
