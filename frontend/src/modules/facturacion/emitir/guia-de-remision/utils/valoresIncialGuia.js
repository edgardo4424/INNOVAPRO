
const guiaInical = {
    tipo_Doc: "09",
    serie: "T001",
    correlativo: "",
    observacion: "",
    fecha_Emision: new Date().toISOString().split("T")[0] + "T05:00:00-05:00",

    estado_Documento: "0",
    empresa_Ruc: "20562974998",

    cliente_Tipo_Doc: "6",
    cliente_Num_Doc: "",
    cliente_Razon_Social: "",
    cliente_Direccion: "",

    guia_Envio_Peso_Total: 0,
    guia_Envio_Und_Peso_Total: "KGM",
    guia_Envio_Fec_Traslado: new Date().toISOString().split("T")[0] + "T05:00:00-05:00",


    guia_Envio_Partida_Ubigeo: "",
    guia_Envio_Partida_Direccion: "",
    guia_Envio_Llegada_Ubigeo: "",
    guia_Envio_Llegada_Direccion: "",

    guia_Envio_Vehiculo_Placa: "",

    detalle: [
    ],

    chofer: [
    ],
}

// ? GUIA DE REMISION PRIVADA
const ValoresPrivado = {
    guia_Envio_Cod_Traslado: "01",
    guia_Envio_Mod_Traslado: "02",
};


// ? GUIA DE REMISION PUBLICA
const ValoresPublico = {

    guia_Envio_Cod_Traslado: "01",
    guia_Envio_Des_Traslado: "VENTA",
    guia_Envio_Mod_Traslado: "01",

    transportista:
    {
        tipo_doc: "6",
        nro_doc: "",
        razon_Social: "",
        nro_mtc: "",
    },

};


// ? GUIA DE REMISION MISMA EMPRESA
const ValoresInterno = {
    guia_Envio_Cod_Traslado: "04",
    guia_Envio_Mod_Traslado: "02",
    guia_Envio_Partida_Ruc: "",
    guia_Envio_Partida_Cod_Local: "00001",
    guia_Envio_Llegada_Ruc: "",
    guia_Envio_Llegada_Cod_Local: "00002",
}


const choferInicialPrivado = {
    tipo: "",
    tipo_doc: "1",
    nro_doc: "",
    licencia: "",
    nombres: "",
    apellidos: "",
};

const detalleInicial = {
    index: null,
    unidad: "KGM",
    cantidad: "",
    cod_Producto: "",
    descripcion: "",
};

export {
    guiaInical,
    ValoresPrivado,
    ValoresPublico,
    ValoresInterno,

    choferInicialPrivado,

    detalleInicial,
};
