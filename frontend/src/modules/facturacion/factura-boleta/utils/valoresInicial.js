// ? VALORES INICIALES ---- INICIO

const ValorInicialFactura = {
    tipo_Operacion: "",
    tipo_Doc: "01",
    serie: "F001",
    correlativo: "",
    tipo_Moneda: "PEN",
    fecha_Emision: new Date().toISOString().split("T")[0] + "T05:00:00-05:00",
    empresa_Ruc: "20607086215",
    cliente_Tipo_Doc: "",
    cliente_Num_Doc: "",
    cliente_Razon_Social: "",
    cliente_Direccion: "",
    monto_Oper_Gravadas: 0,
    monto_Igv: 0,
    total_Impuestos: 0,
    valor_Venta: 0,
    sub_Total: 0,
    monto_Imp_Venta: 0,
    monto_Oper_Exoneradas: 0,
    estado_Documento: "0",
    manual: false,
    id_Base_Dato: "15265",
    observaciones: "", //? nuevo campo solo para bd
    usuario_id: 1, //* cambiar a el usuario logeado
    // ?campos para detraccion
    detraccion_cod_bien_detraccion: "",
    detraccion_cod_medio_pago: "",
    detraccion_cta_banco: "",
    detraccion_percent: 0,
    detraccion_mount: 0,
    // ?campos descuento
    descuento_cod_tipo: "",
    descuento_monto_base: 0,
    descuento_factor: 0,
    descuento_monto: 0,
    detalle: [],
    forma_pago: [],
    legend: [
        {
            legend_Code: "1000",
            legend_Value: "",
        },
    ],
};

const valorInicialProducto = {
    unidad: "",
    cantidad: null,
    cod_Producto: "",
    descripcion: "",
    monto_Valor_Unitario: null,
    monto_Base_Igv: 0,
    porcentaje_Igv: 18.0,
    igv: 0,
    tip_Afe_Igv: "",
    total_Impuestos: 0,
    monto_Precio_Unitario: 0,
    monto_Valor_Venta: 0,
    factor_Icbper: 0,
};

const valorIncialPago = {
    tipo: "",
    monto: 0,
    cuota: 0,
    fecha_Pago: "",
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
    FacturaValidarEstados,
    valorInicialProducto,
    ProductoValidarEstados,
    valorIncialPago,
    PagoValidarEstados,
};
