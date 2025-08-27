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
        tipo_Doc: {
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
        fecha_Emision: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        empresa_Ruc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cliente_Tipo_Doc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cliente_Num_Doc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cliente_Razon_Social: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cliente_Direccion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        guia_Envio_Cod_Traslado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Mod_Traslado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Peso_Total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        guia_Envio_Und_Peso_Total: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Fec_Traslado: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        guia_Envio_Partida_Ubigeo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Partida_Direccion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Llegada_Ubigeo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Llegada_Direccion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        estado_Documento: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        manual: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        id_Base_Dato: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        guia_Envio_Des_Traslado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Vehiculo_Placa: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Partida_Ruc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Partida_Cod_Local: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Llegada_Ruc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        guia_Envio_Llegada_Cod_Local: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        estado: {
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
