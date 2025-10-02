const { DataTypes } = require("sequelize");
const sequelize = require('../../../../config/db'); // Asegúrate de importar correctamente tu instancia de Sequelize

const Cliente = sequelize.define('clientes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    razon_social: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    tipo:{
        type: DataTypes.ENUM('Persona Jurídica','Persona Natural'),
        allowNull: false,
    },
    ruc: {
        type: DataTypes.STRING(11),
        unique: true,
        allowNull: true,
    },
    dni: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    telefono:{
        type: DataTypes.STRING,
    },
    email:{
        type: DataTypes.STRING(255),
        unique: true,
    },
    domicilio_fiscal: {
        type: DataTypes.STRING,
    },
    representante_legal: {
        type: DataTypes.STRING,
    },
    tipo_documento: {
        type: DataTypes.ENUM("DNI", "CE"),
        allowNull: true,
    },
    dni_representante: {
        type: DataTypes.STRING(8),
    },
    creado_por: {
        type: DataTypes.INTEGER,
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: false,
    tableName: "clientes",
});    

Cliente.associate = (models) => {
    Cliente.belongsToMany(models.contactos, {
        through: "contacto_clientes",
        foreignKey: "cliente_id",
        otherKey: "contacto_id",
        as: "contactos_asociados",
    });

    Cliente.hasMany(models.cotizaciones,{
     foreignKey: "cliente_id",
  })
};

module.exports = { Cliente }; // Exporta el modelo para que pueda ser utilizado en otros módulos