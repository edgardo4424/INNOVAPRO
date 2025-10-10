
// ? VALORES INICIALES ---- INICIO

import { obtenerFechaActual } from "@/modules/facturacion/utils/fechaEmisionActual";

const ValorInicialFactura = {
    // ?Datos del comprobante
    tipo_Operacion: "0101",
    tipo_Doc: "01",
    serie: "FT01",
    correlativo: "",
    tipo_Moneda: "PEN",
    fecha_Emision: obtenerFechaActual(),
    fecha_vencimiento: null,
    empresa_Ruc: "20562974998",//?? nuevo ruc de prueba
    dias_pagar: "",
    orden_compra: "",

    // ?Datos del cliente
    cliente_Tipo_Doc: "6",
    cliente_Num_Doc: "",
    cliente_Razon_Social: "",
    cliente_Direccion: "",

    // ?Montos
    monto_Oper_Gravadas: 0,
    monto_Igv: 0,
    total_Impuestos: 0,
    valor_Venta: 0,
    sub_Total: 0,
    monto_Imp_Venta: 0,
    monto_Oper_Exoneradas: 0,

    // ?Base de datos
    estado_Documento: "0",
    manual: false,

    // ?Documentos relacionados
    relDocs: [],

    // ?Parametros para innova Pro
    Observacion: "", //? nuevo campo solo para bd
    // usuario_id: 1, //* cambiar a el usuario logeado

    // ?Lista de Productos
    detalle: [],

    // ?Pagos Maquillados
    neto_Pagar: 0,
    cuotas_Real: [],

    // ?Lista Forma de Pagos
    forma_pago: [],

    // ?lista de leyendas
    legend: [
        {
            legend_Code: "1000",
            legend_Value: "",
        },
    ],
};

const valorIncialPago = [{
    tipo: "",
    monto: 0,
    cuota: 0,
    fecha_Pago: new Date().toISOString().split("T")[0] + "T05:00:00-05:00",
}];


const valorIncialRetencion = {
    descuento_cod_tipo: "62",
    descuento_factor: 0,
    descuento_monto_base: 0,
    descuento_monto: 0,
}

const valorIncialDetracion = {
    detraccion_cod_bien_detraccion: "",
    detraccion_cod_medio_pago: "001",//? valor por defecto deposito en cuenta.
    detraccion_cta_banco: "",
    detraccion_percent: 0,
    detraccion_mount: 0,
}

const valorInicialProducto = {
    unidad: "NIU",
    cantidad: 1,
    cod_Producto: "",
    descripcion: "",
    monto_Valor_Unitario: null,
    monto_Base_Igv: 0,
    porcentaje_Igv: 18.0,
    igv: 0,
    tip_Afe_Igv: "10",
    total_Impuestos: 0,
    monto_Precio_Unitario: 0,
    monto_Valor_Venta: 0,
    factor_Icbper: 0,
};



// ?? VALORES INICIALES ---- FIN

// !! ESTADOS ---- INICIO

const FacturaValidarEstados = {
    tipo_Operacion: false,
    tipo_Doc: false,
    serie: false,
    correlativo: false,
    tipo_Moneda: false,
    fecha_Emision: false,
    empresa_Ruc: false,
    cliente_Tipo_Doc: false,
    cliente_Num_Doc: false,
    cliente_Razon_Social: false,
    cliente_Direccion: false,
};

const ProductoValidarEstados = {
    unidad: false,
    cantidad: false,
    cod_Producto: false,
    descripcion: false,
    monto_Valor_Unitario: false,
    monto_Base_Igv: false,
    porcentaje_Igv: false,
    igv: false,
    tip_Afe_Igv: false,
    total_Impuestos: false,
    monto_Precio_Unitario: false,
    monto_Valor_Venta: false,
    factor_Icbper: false,
};

const PagoValidarEstados = {
    tipo: false,
    monto: false,
    cuota: false,
    fecha_Pago: false,
};

// !! ESTADOS ---- FIN

export {
    ValorInicialFactura,
    valorIncialRetencion,
    valorIncialDetracion,
    FacturaValidarEstados,
    valorInicialProducto,
    ProductoValidarEstados,
    valorIncialPago,
    PagoValidarEstados,
};
