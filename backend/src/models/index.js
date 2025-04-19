"use strict";

const db = {};
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const { Cliente } = require('../modules/clientes/infrastructure/models/clienteModel');
db.clientes = Cliente;

const { Obra } = require('../modules/obras/infrastructure/models/obraModel');
db.obras = Obra;

const { Filial } = require('../modules/filiales/infrastructure/models/filialModel');
db.empresas_proveedoras = Filial;

// Cargar modelos asegurando que coincidan con la base de datos

// Usuarios y roles
db.usuarios = require("./usuarios")(sequelize, DataTypes);

// Entidades comerciales


db.contactos = require("./contactos")(sequelize, DataTypes);


// Cotizaciones
db.cotizaciones = require("./cotizaciones")(sequelize, DataTypes);
db.cotizacion_detalles = require("./cotizacion_detalles")(sequelize, DataTypes);

// Productos y relaciones
db.ProductoServicio = require("./productos_servicios")(sequelize, DataTypes);
db.EmpresaProducto = require("./empresa_producto")(sequelize, DataTypes);

// Tareas
db.tareas = require("./tareas")(sequelize, DataTypes);

// Notificaciones
db.notificaciones = require("./notificacion")(sequelize, DataTypes);

// Relaciones intermedias
db.contacto_clientes = require("./contacto_clientes")(sequelize, DataTypes);
db.contacto_obras = require("./contacto_obras")(sequelize, DataTypes);

// Base de datos de la sunat
db.contrisunat = require("./contrisunat")(sequelize, DataTypes);
db.ubigeos = require("./ubigeos")(sequelize, DataTypes);

// Asociaciones
if (db.clientes.associate) db.clientes.associate(db);
if (db.contactos.associate) db.contactos.associate(db);
if (db.obras.associate) db.obras.associate(db);
if (db.ProductoServicio.associate) db.ProductoServicio.associate(db);
if (db.EmpresaProducto.associate) db.EmpresaProducto.associate(db);
if (db.empresas_proveedoras.associate) db.empresas_proveedoras.associate(db);
if (db.cotizaciones.associate) db.cotizaciones.associate(db);
if (db.cotizacion_detalles.associate) db.cotizacion_detalles.associate(db);
if (db.tareas.associate) db.tareas.associate(db);
if (db.notificaciones.associate) db.notificaciones.associate(db);

// Agregar Sequelize a la exportación
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;