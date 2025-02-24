"use strict";

const db = {};
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Cargar modelos asegurando que coincidan con la base de datos
db.usuarios = require("./usuarios")(sequelize, DataTypes);
db.empresas_proveedoras = require("./empresas")(sequelize, DataTypes);
db.clientes = require("./clientes")(sequelize, DataTypes);
db.obras = require("./obras")(sequelize, DataTypes);
db.contactos = require("./contactos")(sequelize, DataTypes);
db.cotizaciones = require("./cotizaciones")(sequelize, DataTypes);
db.cotizacion_detalles = require("./cotizacion_detalles")(sequelize, DataTypes);

// 📌 Definir relaciones entre las tablas

// 🔹 Un usuario (comercial) puede crear muchas cotizaciones
db["usuarios"].hasMany(db["cotizaciones"], { foreignKey: "usuario_id" });
db["cotizaciones"].belongsTo(db["usuarios"], { foreignKey: "usuario_id" });

// 🔹 Una empresa proveedora puede tener muchas cotizaciones
db["empresas_proveedoras"].hasMany(db["cotizaciones"], { foreignKey: "empresa_proveedora_id" });
db["cotizaciones"].belongsTo(db["empresas_proveedoras"], { foreignKey: "empresa_proveedora_id" });

// 🔹 Un cliente puede tener muchas obras
db["clientes"].hasMany(db["obras"], { foreignKey: "cliente_id", as: "obras" });
db["obras"].belongsTo(db["clientes"], { foreignKey: "cliente_id" });

// 🔹 Un cliente puede tener muchos contactos
db["clientes"].hasMany(db["contactos"], { foreignKey: "cliente_id", as: "contactos" });
db["contactos"].belongsTo(db["clientes"], { foreignKey: "cliente_id", as: "cliente" });

// 🔹 Un cliente puede tener muchas cotizaciones
db["clientes"].hasMany(db["cotizaciones"], { foreignKey: "cliente_id" });
db["cotizaciones"].belongsTo(db["clientes"], { foreignKey: "cliente_id" });

// 🔹 Una obra puede tener muchos contactos
db["obras"].hasMany(db["contactos"], { foreignKey: "obra_id" });
db["contactos"].belongsTo(db["obras"], { foreignKey: "obra_id" });

// 🔹 Una obra puede tener muchas cotizaciones
db["obras"].hasMany(db["cotizaciones"], { foreignKey: "obra_id" });
db["cotizaciones"].belongsTo(db["obras"], { foreignKey: "obra_id" });

// 🔹 Un contacto puede estar relacionado a muchas cotizaciones
db["contactos"].hasMany(db["cotizaciones"], { foreignKey: "contacto_id" });
db["cotizaciones"].belongsTo(db["contactos"], { foreignKey: "contacto_id" });

// 🔹 Una cotización tiene muchos detalles
db["cotizaciones"].hasMany(db["cotizacion_detalles"], { foreignKey: "cotizacion_id" });
db["cotizacion_detalles"].belongsTo(db["cotizaciones"], { foreignKey: "cotizacion_id" });

// Agregar Sequelize a la exportación
db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("✅ Modelos registrados en Sequelize:", Object.keys(db));

module.exports = db;