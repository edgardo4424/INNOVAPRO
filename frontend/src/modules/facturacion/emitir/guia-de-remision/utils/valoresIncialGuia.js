
const guiaInical = {
    tipo_Doc: "09",
    serie: "T001",
    correlativo: "",
    observacion: "",
    fecha_Emision: new Date().toISOString().split("T")[0] + "T05:00:00-05:00",

    estado_Documento: "0",
    empresa_Ruc: "10749283781",

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

    guia_Envio_Vehiculo_Placa: "AXI325",

    detalle: [
    ],

    chofer: [
        {
            tipo: "Principal",
            tipo_doc: "1",
            nro_doc: "10400310",
            licencia: "Q10400310",
            nombres: "CARLOS EDGARDO",
            apellidos: "DELGADO RIVERA",
        },
    ],
}

// ? GUIA DE REMISION PRIVADA
const ValoresPrivado = {

    guia_Envio_Cod_Traslado: "01",
    guia_Envio_Mod_Traslado: "02",

    // chofer: [
    //     {
    //         tipo: "Principal",
    //         tipo_doc: "1",
    //         nro_doc: "10400310",
    //         licencia: "Q10400310",
    //         nombres: "CARLOS EDGARDO",
    //         apellidos: "DELGADO RIVERA",
    //     },
    // ],
};


// ? GUIA DE REMISION PUBLICA
const ValoresPublico = {

    guia_Envio_Cod_Traslado: "01",
    guia_Envio_Des_Traslado: "VENTA",
    guia_Envio_Mod_Traslado: "01",

    transportista:
    {
        tipo_doc: "6",
        nro_doc: "20607663549",
        razon_Social: "TRANSPORTES VILCHEZ CARGO EXPRES S.A.C.",
        nro_mtc: "15145209CNG",
    },

};


// ? GUIA DE REMISION MISMA EMPRESA
const ValoresInterno = {
    guia_Envio_Cod_Traslado: "04",
    guia_Envio_Mod_Traslado: "02",
    guia_Envio_Partida_Ruc: "10749283781",
    guia_Envio_Partida_Cod_Local: "00001",
    guia_Envio_Llegada_Ruc: "10749283781",
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
