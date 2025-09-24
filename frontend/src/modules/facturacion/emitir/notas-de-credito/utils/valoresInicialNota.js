
// ? VALORES INICIALES ---- INICIO
const notaInical = {
    // ?Datos del comprobante
    tipo_Operacion: "0101",
    tipo_Doc: "07",
    serie: "BC01",
    correlativo: "1",
    fecha_Emision: new Date().toISOString().split("T")[0] + "T05:00:00-05:00",
    tipo_Moneda: "PEN",
    estado_Documento: "0",
    empresa_Ruc: "20562974998",
    Manual: false,
    Observacion: "",
    estado: "EMITIDA",


    // ?Datos del cliente
    cliente_Tipo_Doc: "",
    cliente_Num_Doc: "",
    cliente_Razon_Social: "",
    cliente_Direccion: "",

    // ?Montos
    monto_Igv: 0.0,
    total_Impuestos: 0.0,
    valor_Venta: 0.0,
    monto_Oper_Gravadas: 0.0,
    monto_Oper_Exoneradas: 0.0,
    sub_Total: 0.0,
    monto_Imp_Venta: 0.0,

    // ?Datos del afectado
    fecha_Emision_Afectado: null,
    afectado_Tipo_Doc: "",
    afectado_Num_Doc: "",
    motivo_Cod: "",
    motivo_Des: "",

    detalle: [],

    legend: []
}

const ValorInicialDetalleNota = {
    factura_id: "",
    guia_id: "",

    // ?Fecha emision
    // fecha_Emision: "",

    // ?Montos
    monto_Igv: 0,
    total_Impuestos: 0,
    valor_Venta: 0,
    monto_Oper_Gravadas: 0,
    monto_Oper_Exoneradas: 0,
    sub_Total: 0,
    monto_Imp_Venta: 0,


    // ?Lista de Productos
    detalle: [],

};

const valorInicialProducto = {
    id: 0,
    unidad: "",
    cantidad: 0,
    cod_Producto: "",
    descripcion: "",
    monto_Valor_Unitario: 0,
    monto_Base_Igv: 0,
    monto_Precio_Unitario: 0,
    monto_Valor_Venta: 0,
    porcentaje_Igv: 0,
    igv: 0.,
    tip_Afe_Igv: "",
    factor_Icbper: 0,
    total_Impuestos: 0,
    codigo: "",
    cod_Prod_Sunat: ""
};

const valorIncialDescuentoGlobal = {
    unidad: "NIU",
    cantidad: 1,
    cod_Producto: "",
    descripcion: "DESCUENTO",
    monto_Valor_Unitario: 0,
    monto_Base_Igv: 0,
    monto_Precio_Unitario: 0,
    monto_Valor_Venta: 0,
    porcentaje_Igv: 0,
    igv: 0.,
    tip_Afe_Igv: "10",
    factor_Icbper: 0,
    total_Impuestos: 0,
    codigo: "",
    cod_Prod_Sunat: "",
}

const valorIncialDescuentoItem = {
    id: 0,
    unidad: "",
    cantidad: 1,
    cod_Producto: "",
    descripcion: "",
    monto_Valor_Unitario: 0,
    monto_Base_Igv: 0,
    monto_Precio_Unitario: 0,
    monto_Valor_Venta: 0,
    porcentaje_Igv: 0,
    igv: 0.,
    tip_Afe_Igv: "",
    factor_Icbper: 0,
    total_Impuestos: 0,
    codigo: "",
    cod_Prod_Sunat: "",
    Descuentos: [
        {
            CodTipo: "00",
            MontoBase: 0,
            Factor: 0,
            Monto: 0
        }
    ]
}

const valorIncialDescuentos = [
    {
        CodTipo: "00",
        MontoBase: 0,
        Factor: 0,
        Monto: 0
    }
]


export { notaInical, valorInicialProducto, ValorInicialDetalleNota, valorIncialDescuentoGlobal, valorIncialDescuentoItem, valorIncialDescuentos }