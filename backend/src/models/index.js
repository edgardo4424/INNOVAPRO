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
if (db.cotizaciones.associate) db.cotizaciones.associate(db);
if (db.cotizacion_detalles.associate) db.cotizacion_detalles.associate(db);

// Agregar Sequelize a la exportación
db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("✅ Modelos registrados en Sequelize:", Object.keys(db));

module.exports = db;