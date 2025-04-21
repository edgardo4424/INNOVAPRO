"use strict";

const db = {};
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Módulos con modelos modernos y centralizados
const { Cliente } = require('../modules/clientes/infrastructure/models/clienteModel');
db.clientes = Cliente;

const { Obra } = require('../modules/obras/infrastructure/models/obraModel');
db.obras = Obra;

const { Filial } = require('../modules/filiales/infrastructure/models/filialModel');
db.empresas_proveedoras = Filial;

const { Usuario } = require('../modules/usuarios/infrastructure/models/usuarioModel');
db.usuarios = Usuario;

const { Contacto } = require('../modules/contactos/infrastructure/models/contactoModel');
db.contactos = Contacto;

db.contacto_clientes = require("./contacto_clientes")(sequelize, DataTypes);
db.contacto_obras = require("./contacto_obras")(sequelize, DataTypes);

const { Notificaciones } = require('../modules/notificaciones/infrastructure/models/notificacionModel');
db.notificaciones = Notificaciones;


// Cotizaciones
db.cotizaciones = require("./cotizaciones")(sequelize, DataTypes);
db.cotizacion_detalles = require("./cotizacion_detalles")(sequelize, DataTypes);

// Productos
db.ProductoServicio = require("./productos_servicios")(sequelize, DataTypes);
db.EmpresaProducto = require("./empresa_producto")(sequelize, DataTypes);

// Tareas 
const { Tarea } = require('../modules/tareas/infrastructure/models/tareaModel');
db.tareas = Tarea;

// SUNAT
db.contrisunat = require("./contrisunat")(sequelize, DataTypes);
db.ubigeos = require("./ubigeos")(sequelize, DataTypes);

// ✅ Solo se asocian los que tienen .associate()
if (db.contactos.associate) db.contactos.associate(db);
if (db.clientes.associate) db.clientes.associate(db);
if (db.obras.associate) db.obras.associate(db);
if (db.ProductoServicio.associate) db.ProductoServicio.associate(db);
if (db.EmpresaProducto.associate) db.EmpresaProducto.associate(db);
if (db.empresas_proveedoras.associate) db.empresas_proveedoras.associate(db);
if (db.cotizaciones.associate) db.cotizaciones.associate(db);
if (db.cotizacion_detalles.associate) db.cotizacion_detalles.associate(db);
if (db.tareas.associate) db.tareas.associate(db);
if (db.notificaciones.associate) db.notificaciones.associate(db);

// Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;