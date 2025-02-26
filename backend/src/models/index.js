"use strict";

const db = {};
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Cargar modelos asegurando que coincidan con la base de datos
db.usuarios = require("./usuarios")(sequelize, DataTypes);
db.empresas_proveedoras = require("./empresas")(sequelize, DataTypes);
db.clientes = require("./clientes")(sequelize, DataTypes);
db.contactos = require("./contactos")(sequelize, DataTypes);
db.obras = require("./obras")(sequelize, DataTypes);
db.cotizaciones = require("./cotizaciones")(sequelize, DataTypes);
db.cotizacion_detalles = require("./cotizacion_detalles")(sequelize, DataTypes);
db.contacto_clientes = require("./contacto_clientes")(sequelize, DataTypes);
db.contacto_obras = require("./contacto_obras")(sequelize, DataTypes);
db.ProductoServicio = require("./productos_servicios")(sequelize, DataTypes);
db.EmpresaProducto = require("./empresa_producto")(sequelize, DataTypes);

// Asociaciones
if (db.clientes.associate) db.clientes.associate(db);
if (db.contactos.associate) db.contactos.associate(db);
if (db.obras.associate) db.obras.associate(db);
if (db.ProductoServicio.associate) db.ProductoServicio.associate(db);
if (db.EmpresaProducto.associate) db.EmpresaProducto.associate(db);
if (db.empresas_proveedoras.associate) db.empresas_proveedoras.associate(db);

/*
// 📌 Definir relaciones entre las tablas

// 🔹 Un usuario (comercial) puede crear muchas cotizaciones
db.usuarios.hasMany(db.cotizaciones, { foreignKey: "usuario_id" });
db.cotizaciones.belongsTo(db.usuarios, { foreignKey: "usuario_id" });

// 🔹 Una empresa proveedora puede tener muchas cotizaciones
db.empresas_proveedoras.hasMany(db.cotizaciones, { foreignKey: "empresa_proveedora_id" });
db.cotizaciones.belongsTo(db.empresas_proveedoras, { foreignKey: "empresa_proveedora_id" });

// 🔹 Un cliente puede tener muchas obras
db.clientes.hasMany(db.obras, { foreignKey: "cliente_id", as: "obras" });
db.obras.belongsTo(db.clientes, { foreignKey: "cliente_id" });

// ✅ Relación Muchos a Muchos usando la tabla intermedia contacto_clientes
db.clientes.belongsToMany(db.contactos, {
    through: db.contacto_clientes,
    foreignKey: "cliente_id",
    otherKey: "contacto_id",
    as: "contactos",
});

db.contactos.belongsToMany(db.clientes, {
    through: db.contacto_clientes,
    foreignKey: "contacto_id",
    otherKey: "cliente_id",
    as: "clientes",
});

// 🔹 Un cliente puede tener muchas cotizaciones
db.clientes.hasMany(db.cotizaciones, { foreignKey: "cliente_id" });
db.cotizaciones.belongsTo(db.clientes, { foreignKey: "cliente_id" });

// ✅ Relación Muchos a Muchos usando la tabla intermedia contacto_obras
db.obras.belongsToMany(db.contactos, {
    through: db.contacto_obras,
    foreignKey: "obra_id",
    otherKey: "contacto_id",
    as: "contactos",
});

db.contactos.belongsToMany(db.obras, {
    through: db.contacto_obras,
    foreignKey: "contacto_id",
    otherKey: "obra_id",
    as: "obras",
});

// 🔹 Una obra puede tener muchas cotizaciones
db.obras.hasMany(db.cotizaciones, { foreignKey: "obra_id" });
db.cotizaciones.belongsTo(db.obras, { foreignKey: "obra_id" });

// 🔹 Un contacto puede estar relacionado a muchas cotizaciones
db.contactos.hasMany(db.cotizaciones, { foreignKey: "contacto_id" });
db.cotizaciones.belongsTo(db.contactos, { foreignKey: "contacto_id" });
*/

// Agregar Sequelize a la exportación
db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("✅ Modelos registrados en Sequelize:", Object.keys(db));

module.exports = db;