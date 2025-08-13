// ? GUIA DE REMISION PRIVADA
// ** VALORES INICIAL
const guiaPrivada = {
    tipo_Doc: "09",
    serie: "T001",
    correlativo: "1",
    observacion: "",
    fecha_Emision: new Date().toISOString().split("T")[0] + "T05:00:00-05:00",

    empresa_Ruc: "20607086215",

    cliente_Tipo_Doc: "6",
    cliente_Num_Doc: "20603021933",
    cliente_Razon_Social: "INNOVA RENTAL MAQUINARIA SAC",
    cliente_Direccion: "AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE, LIMA - LIMA - MIRAFLORES",

    guia_Envio_Cod_Traslado: "01",
    guia_Envio_Mod_Traslado: "02",
    guia_Envio_Peso_Total: 1.56,
    guia_Envio_Und_Peso_Total: "KGM",
    guia_Envio_Fec_Traslado: "",

    guia_Envio_Vehiculo_Placa: "AXI325",

    guia_Envio_Partida_Ubigeo: "",
    guia_Envio_Partida_Direccion: "",
    guia_Envio_Llegada_Ubigeo: "",
    guia_Envio_Llegada_Direccion: "",

    estado_Documento: "0",
    manual: false,
    id_Base_Dato: "15265",

    chofer: [
        {
            tipo: "",
            tipo_doc: "1",
            nro_doc: "44004477",
            licencia: "0001122085",
            nombres: "JUAN PEREZ",
            apellidos: "BENITO CRUZ",
        },
    ],
    detalle: [
        {
            unidad: "KGM",
            cantidad: 1.56,
            cod_Producto: "140",
            descripcion: "PRODUCTO 1",
        },
    ],
};

//  !! VALORES VALIDACION
const guiaPrivadaValidar = {
    tipo_Doc: false,
    serie: false,
    correlativo: false,
    observacion: false,
    fecha_Emision: false,

    empresa_Ruc: false,

    cliente_Tipo_Doc: false,
    cliente_Num_Doc: false,
    cliente_Razon_Social: false,
    cliente_Direccion: false,

    guia_Envio_Cod_Traslado: false,
    guia_Envio_Mod_Traslado: false,
    guia_Envio_Peso_Total: false,
    guia_Envio_Und_Peso_Total: false,
    guia_Envio_Fec_Traslado: false,

    guia_Envio_Vehiculo_Placa: false,

    guia_Envio_Partida_Ubigeo: false,
    guia_Envio_Partida_Direccion: false,
    guia_Envio_Llegada_Ubigeo: false,
    guia_Envio_Llegada_Direccion: false,

    estado_Documento: false,
    manual: false,
    id_Base_Dato: false,

    chofer: [
        {
            tipo: false,
            tipo_doc: false,
            nro_doc: false,
            licencia: false,
            nombres: false,
            apellidos: false,
        },
    ],
    detalle: [
        {
            unidad: false,
            cantidad: false,
            cod_Producto: false,
            descripcion: false,
        },
    ],
};

// ? GUIA DE REMISION PUBLICA
// ** VALORES INICIAL
const guiaPublica = {
    tipo_Doc: "09",
    serie: "T001",
    correlativo: "1",
    observacion: "PRUEBA DE GUIA",
    fecha_Emision: new Date().toISOString().split("T")[0] + "T05:00:00-05:00",

    empresa_Ruc: "20607086215",

    cliente_Tipo_Doc: "6",
    cliente_Num_Doc: "20604915351",
    cliente_Razon_Social: "MEN GRAPH S.A.C.",
    cliente_Direccion: "-",

    guia_Envio_Cod_Traslado: "01",
    guia_Envio_Des_Traslado: "VENTA",
    guia_Envio_Mod_Traslado: "01",
    guia_Envio_Peso_Total: 10,
    guia_Envio_Und_Peso_Total: "KGM",
    guia_Envio_Fec_Traslado: "",
    guia_Envio_Partida_Ubigeo: "150203",
    guia_Envio_Partida_Direccion: "AV. CACEREES 459",
    guia_Envio_Llegada_Ubigeo: "150204",
    guia_Envio_Llegada_Direccion: "AV. LA MARINA 569",

    estado_Documento: "0",
    manual: false,
    id_Base_Dato: "15265",
    chofer: [
        {
            tipo_doc: "6",
            nro_doc: "20000000002",
            nombres: "TRANSPORTES S.A.C",
            nro_mtc: "0001",
        },
    ],

    detalle: [
        {
            unidad: "",
            cantidad: 0,
            cod_Producto: "",
            descripcion: "",
        },
    ],
};

//  !! VALORES VALIDACION
const guiaPublicaValidar = {
    tipo_Doc: false,
    serie: false,
    correlativo: false,
    observacion: false,
    fecha_Emision: false,

    empresa_Ruc: false,

    cliente_Tipo_Doc: false,
    cliente_Num_Doc: false,
    cliente_Razon_Social: false,
    cliente_Direccion: false,

    guia_Envio_Cod_Traslado: false,
    guia_Envio_Des_Traslado: false,
    guia_Envio_Mod_Traslado: false,
    guia_Envio_Peso_Total: false,
    guia_Envio_Und_Peso_Total: false,
    guia_Envio_Fec_Traslado: false,

    guia_Envio_Partida_Ubigeo: false,
    guia_Envio_Partida_Direccion: false,
    guia_Envio_Llegada_Ubigeo: false,
    guia_Envio_Llegada_Direccion: false,

    estado_Documento: false,
    manual: false,
    id_Base_Dato: false,

    chofer: [
        {
            tipo_doc: false,
            nro_doc: false,
            nombres: false,
            nro_mtc: false,
        },
    ],
    detalle: [
        {
            unidad: false,
            cantidad: false,
            cod_Producto: false,
            descripcion: false,
        },
    ]
};

// ? GUIA DE REMISION MISMA EMPRESA
// ** VALORES INICIAL
const guiaMismaEmpresa = {
    tipo_Doc: "09",
    serie: "T001",
    correlativo: "1",
    observacion: "PRUEBA DE GUIA",
    fecha_Emision: new Date().toISOString().split("T")[0] + "T05:00:00-05:00",

    empresa_Ruc: "20607086215",

    cliente_Tipo_Doc: "6",
    cliente_Num_Doc: "20604915351",
    cliente_Razon_Social: "MEN GRAPH S.A.C.",
    cliente_Direccion: "-",

    guia_Envio_Cod_Traslado: "01",
    guia_Envio_Mod_Traslado: "02",
    guia_Envio_Peso_Total: 12.5,
    guia_Envio_Und_Peso_Total: "KGM",
    guia_Envio_Fec_Traslado: "2024-12-31T13:21:12-05:00",

    guia_Envio_Partida_Ubigeo: "150203",
    guia_Envio_Partida_Direccion: "AV. CACEREES 459",
    guia_Envio_Partida_Ruc: "20000000001",
    guia_Envio_Partida_Cod_Local: "00001",

    guia_Envio_Llegada_Ubigeo: "150204",
    guia_Envio_Llegada_Direccion: "AV. LA MARINA 569",
    guia_Envio_Llegada_Ruc: "20000000001",
    guia_Envio_Llegada_Cod_Local: "00002",

    estado_Documento: "0",
    manual: false,
    id_Base_Dato: "15265",

    detalle: [
        {
            unidad: "KGM",
            cantidad: 1.56,
            cod_Producto: "140",
            descripcion: "PRODUCTO 1",
        },
    ],
};

// !! VALORES VALIDACION
const guiaMismaEmpresaValidar = {
    tipo_Doc: false,
    serie: false,
    correlativo: false,
    observacion: false,
    fecha_Emision: false,

    empresa_Ruc: false,

    cliente_Tipo_Doc: false,
    cliente_Num_Doc: false,
    cliente_Razon_Social: false,
    cliente_Direccion: false,

    guia_Envio_Cod_Traslado: false,
    guia_Envio_Mod_Traslado: false,
    guia_Envio_Peso_Total: false,
    guia_Envio_Und_Peso_Total: false,
    guia_Envio_Fec_Traslado: false,

    guia_Envio_Partida_Ubigeo: false,
    guia_Envio_Partida_Direccion: false,
    guia_Envio_Partida_Ruc: false,
    guia_Envio_Partida_Cod_Local: false,

    guia_Envio_Llegada_Ubigeo: false,
    guia_Envio_Llegada_Direccion: false,
    guia_Envio_Llegada_Ruc: false,
    guia_Envio_Llegada_Cod_Local: false,

    estado_Documento: false,
    manual: false,
    id_Base_Dato: false,

    detalle: [
        {
            unidad: false,
            cantidad: false,
            cod_Producto: false,
            descripcion: false,
        },
    ]
};

const choferInicialPrivado = {
    tipo: "",
    tipo_doc: "1",
    nro_doc: "",
    licencia: "",
    nombres: "",
    apellidos: "",
};
const choferInicialPublico = {
    tipo_doc: "1",
    nro_doc: "",
    nombres: "",
    nro_mtc: "",
};

const detalleInicial = {
    unidad: "",
    cantidad: "",
    cod_Producto: "",
    descripcion: "",
};

export {
    guiaPrivada,
    guiaPublica,
    guiaMismaEmpresa,

    guiaPrivadaValidar,
    guiaPublicaValidar,
    guiaMismaEmpresaValidar,

    choferInicialPrivado,
    choferInicialPublico,

    detalleInicial,
};
