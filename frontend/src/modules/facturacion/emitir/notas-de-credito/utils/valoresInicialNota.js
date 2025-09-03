
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
    empresa_Ruc: "10749283781",
    Manual: false,
    Observacion: "",


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
    afectado_Tipo_Doc: "",
    afectado_Num_Doc: "",
    motivo_Cod: "",
    motivo_Des: "",

    detalle: [],

    legend: []
}

const valorInicialProducto = {
    unidad: "ZZ",
    cantidad: 1.0,
    cod_Producto: "1145",
    descripcion: "NIÑOS ADOLESCENTES Y ADULTOS 3 VECES POR SEMANA",
    monto_Valor_Unitario: 330.0,
    monto_Base_Igv: 330.0,
    monto_Precio_Unitario: 330.0,
    monto_Valor_Venta: 330.0,
    porcentaje_Igv: 0.0,
    igv: 0.0,
    tip_Afe_Igv: "20",
    factor_Icbper: 0.0,
    total_Impuestos: 0.0,
    codigo: "",
    cod_Prod_Sunat: ""
};

export { notaInical, valorInicialProducto }