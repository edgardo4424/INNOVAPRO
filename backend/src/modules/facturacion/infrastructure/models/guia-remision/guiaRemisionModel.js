const { DataTypes } = require("sequelize");
const sequelize = require("../../../../../config/db");

const GuiaRemision = sequelize.define(
    "guias_de_remision",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tipo_doc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        serie: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        correlativo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        observacion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fecha_emision: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        empresa_ruc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cliente_tipo_doc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cliente_num_doc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cliente_razon_social: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cliente_direccion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        guia_envio_cod_traslado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_mod_traslado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_peso_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        guia_envio_und_peso_total: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_fec_traslado: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        guia_envio_partida_ubigeo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_partida_direccion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_llegada_ubigeo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_llegada_direccion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        estado_documento: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        manual: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        id_base_dato: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        guia_envio_des_traslado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_vehiculo_placa: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_partida_ruc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_partida_cod_local: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_llegada_ruc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_envio_llegada_cod_local: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: "guias_de_remision",
    }
);

GuiaRemision.associate = (models) => {
    GuiaRemision.hasMany(models.guia_detalles, {
        foreignKey: "guia_id",
    })
    GuiaRemision.hasMany(models.guia_choferes, {
        foreignKey: "guia_id",
    })
    GuiaRemision.hasMany(models.sunat_respuesta, {
        foreignKey: "guia_id",
    })
}

module.exports = { GuiaRemision };
