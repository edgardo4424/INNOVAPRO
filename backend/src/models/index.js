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

const { ContriSUNAT } = require('../modules/sunat/infrastructure/models/contrisunat');
db.contrisunat = ContriSUNAT;

const { Ubigeo } = require('../modules/sunat/infrastructure/models/ubigeos');
db.ubigeos = Ubigeo;

// Cotizaciones
db.cotizaciones = require("./cotizaciones")(sequelize, DataTypes);
db.cotizacion_detalles = require("./cotizacion_detalles")(sequelize, DataTypes);

// Productos
db.ProductoServicio = require("./productos_servicios")(sequelize, DataTypes);
db.EmpresaProducto = require("./empresa_producto")(sequelize, DataTypes);

// Tareas 
const { Tarea } = require('../modules/tareas/infrastructure/models/tareaModel');
db.tareas = Tarea;

// Familias Piezas
const { FamiliaPieza } = require('../modules/familias_piezas/infrastructure/models/familiaPiezaModel')
db.familias_piezas = FamiliaPieza

const { Pieza } = require('../modules/piezas/infrastructure/models/piezaModel')
db.piezas = Pieza

const { Despiece } = require('../modules/despieces/infrastructure/models/despieceModel')
db.despieces = Despiece

const { DespieceDetalle } = require('../modules/despieces_detalles/infrastructure/models/despieceDetalleModel')
db.despieces_detalle = DespieceDetalle

const { Uso } = require('../modules/usos/infrastructure/models/usoModel')
db.usos = Uso;

const { PiezasUsos } = require('../modules/piezas_usos/infrastructure/models/piezasUsosModel')
db.piezas_usos = PiezasUsos;

const { Atributo } = require('../modules/atributos/infrastructure/models/atributoModel')
db.atributos = Atributo;

const { AtributosValor } = require('../modules/atributos_valor/infrastructure/models/atributosValorModel')
db.atributos_valor = AtributosValor;

const { Cotizacion } = require('../modules/cotizaciones/infrastructure/models/cotizacionModel')
db.cotizaciones = Cotizacion;

const { EstadosCotizacion } = require('../modules/estados_cotizacion/infrastructure/models/estadosCotizacionModel')
db.estados_cotizacion = EstadosCotizacion;

const { TarifasTransporte } = require('../modules/tarifas_transporte/infrastructure/models/tarifasTransporteModel')
db.tarifas_transporte = TarifasTransporte;

const { DistritosTransporte } = require('../modules/distritos_transporte/infrastructure/models/distritosTransporteModel')
db.distritos_transporte = DistritosTransporte;

const { CostosPernocteTransporte } = require('../modules/cotizaciones/costos_pernocte_transporte/infrastructure/models/costosPernocteTransporteModel')
db.costos_pernocte_transporte = CostosPernocteTransporte;

const { CotizacionesTransporte } = require('../modules/cotizaciones_transporte/infrastructure/models/cotizacionesTransporteModel')
db.cotizaciones_transporte = CotizacionesTransporte;

const { CotizacionesInstalacion } = require('../modules/cotizaciones/infrastructure/models/cotizacionesInstalacionesModel')
db.cotizaciones_instalacion = CotizacionesInstalacion;

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
if (db.contrisunat.associate) db.contrisunat.associate(db);
if (db.familias_piezas.associate) db.familias_piezas.associate(db)
if (db.piezas.associate) db.piezas.associate(db)
if (db.despieces.associate) db.despieces.associate(db)
if (db.despieces_detalle.associate) db.despieces_detalle.associate(db)
if (db.usos.associate) db.usos.associate(db)
if (db.piezas_usos.associate) db.piezas_usos.associate(db)
if (db.atributos.associate) db.atributos.associate(db)
if (db.atributos_valor.associate) db.atributos_valor.associate(db)
if (db.cotizaciones.associate) db.cotizaciones.associate(db)
if (db.estados_cotizacion) db.estados_cotizacion.associate(db)
if (db.tarifas_transporte) db.tarifas_transporte.associate(db)
if (db.distritos_transporte) db.distritos_transporte.associate(db)
//if (db.costos_pernocte_transporte) db.costos_pernocte_transporte.associate(db)
if (db.cotizaciones_transporte) db.cotizaciones_transporte.associate(db)
if (db.cotizaciones_instalacion) db.cotizaciones_instalacion.associate(db)

// Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;