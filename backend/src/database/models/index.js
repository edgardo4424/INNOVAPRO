"use strict";

const db = {};
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

// Módulos con modelos modernos y centralizados
const {
   Cliente,
} = require("../../modules/clientes/infrastructure/models/clienteModel");
db.clientes = Cliente;

const {
   Trabajador,
} = require("../../modules/trabajadores/infraestructure/models/trabajadorModel");
db.trabajadores = Trabajador;

const {
   Cargo,
} = require("../../modules/trabajadores/infraestructure/models/cargoModel");
db.cargos = Cargo;
const {
   Area,
} = require("../../modules/trabajadores/infraestructure/models/areaModel");
db.areas = Area;

const {
   Asistencia,
} = require("../../modules/asistencias/infraestructure/models/asistenciaModel");
db.asistencias = Asistencia;

const {
   ContratoLaboral,
} = require("../../modules/contratos_laborales/infraestructure/models/contratoLaboralModel");
db.contratos_laborales = ContratoLaboral;
const {
   Vacaciones,
} = require("../../modules/vacaciones/infraestructure/models/vacacionesModel");
db.vacaciones = Vacaciones;
const { Bonos } = require("../../modules/bonos/infraestructure/models/bonoModel");
db.bonos = Bonos;

const { AdelantoSueldo } = require("../../modules/adelanto_sueldo/infraestructure/models/adelantoSueldoModel");
db.adelanto_sueldo = AdelantoSueldo;

const {
   Gasto,
} = require("../../modules/asistencias/infraestructure/models/gastoModel");
db.gastos = Gasto;
const {
   Jornada,
} = require("../../modules/asistencias/infraestructure/models/jornadaModel");
db.jornadas = Jornada;
const {
   TipoTrabajo,
} = require("../../modules/asistencias/infraestructure/models/tipotrabajoModel");
db.tipos_trabajo = TipoTrabajo;

const { Obra } = require("../../modules/obras/infrastructure/models/obraModel");
db.obras = Obra;

const {
   Filial,
} = require("../../modules/filiales/infrastructure/models/filialModel");
db.empresas_proveedoras = Filial;

const {
   Usuario,
} = require("../../modules/usuarios/infrastructure/models/usuarioModel");
db.usuarios = Usuario;

const {
   Contacto,
} = require("../../modules/contactos/infrastructure/models/contactoModel");
db.contactos = Contacto;


db.contacto_clientes = require("./contacto_clientes")(sequelize, DataTypes);
db.contacto_obras = require("./contacto_obras")(sequelize, DataTypes);

const {
   Notificaciones,
} = require("../../modules/notificaciones/infrastructure/models/notificacionModel");
db.notificaciones = Notificaciones;

// Condiciones de alquiler
const CondicionAlquiler = require("../../modules/cotizaciones/infrastructure/models/condicionAlquilerModel");
db.condiciones_alquiler = CondicionAlquiler;

// Tareas
const { Tarea } = require("../../modules/tareas/infrastructure/models/tareaModel");
db.tareas = Tarea;

// Familias Piezas
const {
   FamiliaPieza,
} = require("../../modules/familias_piezas/infrastructure/models/familiaPiezaModel");
db.familias_piezas = FamiliaPieza;

const { Pieza } = require("../../modules/piezas/infrastructure/models/piezaModel");
db.piezas = Pieza;

const {
   Despiece,
} = require("../../modules/despieces/infrastructure/models/despieceModel");
db.despieces = Despiece;

const {
   DespieceDetalle,
} = require("../../modules/despieces_detalles/infrastructure/models/despieceDetalleModel");
db.despieces_detalle = DespieceDetalle;

const { Uso } = require("../../modules/usos/infrastructure/models/usoModel");
db.usos = Uso;

const {
   PiezasUsos,
} = require("../../modules/piezas_usos/infrastructure/models/piezasUsosModel");
db.piezas_usos = PiezasUsos;

const {
   Atributo,
} = require("../../modules/atributos/infrastructure/models/atributoModel");
db.atributos = Atributo;

const {
   AtributosValor,
} = require("../../modules/atributos_valor/infrastructure/models/atributosValorModel");
db.atributos_valor = AtributosValor;

const {
   Cotizacion,
} = require("../../modules/cotizaciones/infrastructure/models/cotizacionModel");
db.cotizaciones = Cotizacion;

const {
   EstadosCotizacion,
} = require("../../modules/estados_cotizacion/infrastructure/models/estadosCotizacionModel");
db.estados_cotizacion = EstadosCotizacion;

const {
   TarifasTransporte,
} = require("../../modules/tarifas_transporte/infrastructure/models/tarifasTransporteModel");
db.tarifas_transporte = TarifasTransporte;

const {
   DistritosTransporte,
} = require("../../modules/distritos_transporte/infrastructure/models/distritosTransporteModel");
db.distritos_transporte = DistritosTransporte;

const {
   CostosPernocteTransporte,
} = require("../../modules/cotizaciones/costos_pernocte_transporte/infrastructure/models/costosPernocteTransporteModel");
db.costos_pernocte_transporte = CostosPernocteTransporte;

const {
   CotizacionesTransporte,
} = require("../../modules/cotizaciones_transporte/infrastructure/models/cotizacionesTransporteModel");
db.cotizaciones_transporte = CotizacionesTransporte;

const {
   CotizacionesInstalacion,
} = require("../../modules/cotizaciones/infrastructure/models/cotizacionesInstalacionesModel");
db.cotizaciones_instalacion = CotizacionesInstalacion;

// ? Facturacion
// todo de factura - boleta
const { Factura } = require('../../modules/facturacion/infrastructure/models/factura-boleta/facturaModel')
db.factura = Factura;

const { DetalleFactura } = require('../../modules/facturacion/infrastructure/models/factura-boleta/facturaDetalleModel')
db.detalle_factura = DetalleFactura;

const { FormaPagoFactura } = require('../../modules/facturacion/infrastructure/models/factura-boleta/formaPagoModel')
db.forma_pago_factura = FormaPagoFactura;

const { LegendFactura } = require('../../modules/facturacion/infrastructure/models/factura-boleta/legendFacturaModel')
db.legend_factura = LegendFactura;

// todo guia de remision
const { GuiaRemision } = require('../../modules/facturacion/infrastructure/models/guia-remision/guiaRemisionModel')
db.guias_de_remision = GuiaRemision

const { GuiaDetalles } = require('../../modules/facturacion/infrastructure/models/guia-remision/guiaDetallesModel')
db.guia_detalles = GuiaDetalles

const { GuiaChoferes } = require('../../modules/facturacion/infrastructure/models/guia-remision/guiaChoferesModel')
db.guia_choferes = GuiaChoferes

// todo notas de credito y debito
const { NotasCreditoDebito } = require('../../modules/facturacion/infrastructure/models/notas-credito-debito/notasCreditoDebitoModel')
db.notas_credito_debito = NotasCreditoDebito

const { LegendNotaCreditoDebito } = require('../../modules/facturacion/infrastructure/models/notas-credito-debito/legendNotaCreditoDebitoModel')
db.legend_nota_cre_deb = LegendNotaCreditoDebito

const { DetalleNotaCreditoDebito } = require('../../modules/facturacion/infrastructure/models/notas-credito-debito/detalleNotaCreditoDebitoModel')
db.detalle_nota_cre_deb = DetalleNotaCreditoDebito

// todo respuesta de sunat
const { SunatRespuesta } = require('../../modules/facturacion/infrastructure/models/sunatRespuestaModel')
db.sunat_respuesta = SunatRespuesta

// todo ruc
const { RucFacturacion } = require('../../modules/facturacion/infrastructure/models/rucFacturacionModel')
db.ruc_facturacion = RucFacturacion

// todo borrador
const { Borrador } = require('../../modules/facturacion/infrastructure/models/borrador/borradorModel')
db.borradores = Borrador;

// * Ubigeo
const { Ubigeo } = require("../../modules/ubigeo/infrastructure/models/ubigeoModel");
db.ubigeos = Ubigeo;


// ✅ Solo se asocian los que tienen .associate()
if (db.contactos.associate) db.contactos.associate(db);
if (db.clientes.associate) db.clientes.associate(db);
if (db.obras.associate) db.obras.associate(db);
if (db.empresas_proveedoras.associate) db.empresas_proveedoras.associate(db);
if (db.cotizaciones.associate) db.cotizaciones.associate(db);
if (db.condiciones_alquiler.associate) db.condiciones_alquiler.associate(db);
if (db.tareas.associate) db.tareas.associate(db);
if (db.notificaciones.associate) db.notificaciones.associate(db);
if (db.familias_piezas.associate) db.familias_piezas.associate(db);
if (db.piezas.associate) db.piezas.associate(db);
if (db.despieces.associate) db.despieces.associate(db);
if (db.despieces_detalle.associate) db.despieces_detalle.associate(db);
if (db.usos.associate) db.usos.associate(db);
if (db.piezas_usos.associate) db.piezas_usos.associate(db);
if (db.atributos.associate) db.atributos.associate(db);
if (db.atributos_valor.associate) db.atributos_valor.associate(db);
if (db.cotizaciones.associate) db.cotizaciones.associate(db);
if (db.estados_cotizacion) db.estados_cotizacion.associate(db);
if (db.tarifas_transporte) db.tarifas_transporte.associate(db);
if (db.distritos_transporte) db.distritos_transporte.associate(db);
//if (db.costos_pernocte_transporte) db.costos_pernocte_transporte.associate(db)
if (db.cotizaciones_transporte) db.cotizaciones_transporte.associate(db);
if (db.cotizaciones_instalacion) db.cotizaciones_instalacion.associate(db);
if (db.trabajadores.associate) db.trabajadores.associate(db);
if (db.vacaciones.associate) db.vacaciones.associate(db);
if (db.contratos_laborales.associate) db.contratos_laborales.associate(db);
if (db.bonos.associate) db.bonos.associate(db);
if (db.adelanto_sueldo.associate) db.adelanto_sueldo.associate(db);
if (db.asistencias.associate) db.asistencias.associate(db);
if (db.gastos.associate) db.gastos.associate(db);
if (db.jornadas.associate) db.jornadas.associate(db);
if (db.tipos_trabajo.associate) db.tipos_trabajo.associate(db);

// ? Conexion Facturacion
if (db.factura.associate) db.factura.associate(db);
if (db.detalle_factura.associate) db.detalle_factura.associate(db);
if (db.forma_pago_factura.associate) db.forma_pago_factura.associate(db);
if (db.legend_factura.associate) db.legend_factura.associate(db)
if (db.guias_de_remision.associate) db.guias_de_remision.associate(db)
if (db.guia_detalles.associate) db.guia_detalles.associate(db)
if (db.guia_choferes.associate) db.guia_choferes.associate(db)
if (db.notas_credito_debito.associate) db.notas_credito_debito.associate(db)
if (db.legend_nota_cre_deb) db.legend_nota_cre_deb.associate(db)
if (db.detalle_nota_cre_deb) db.detalle_nota_cre_deb.associate(db)
if (db.sunat_respuesta.associate) db.sunat_respuesta.associate(db)
if (db.ruc_facturacion.associate) db.ruc_facturacion.associate(db)
if (db.borradores.associate) db.borradores.associate(db)

// * Ubigeo
if(db.ubigeos) db.ubigeos.associate(db)

if (db.cargos) db.cargos.associate(db);
if (db.areas) db.areas.associate(db);


// Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;