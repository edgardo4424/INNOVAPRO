const valorIncialTransporte = {
    id: null,
    nro_doc: "",
    razon_social: "",
    nro_mtc: "",
    vehiculos: [],
}

const valorInicialVehicular = {
    id: null,
    nro_placa: "",
    marca: "",
    color: "",
    tuce_certificado: "",
    id_transportista: null
}

const valorIncialChofer = {
    id: null,
    tipo_doc: "1",
    nro_doc: "",
    nombres: "",
    apellidos: "",
    nro_licencia: "",
}

export { valorIncialChofer, valorIncialTransporte, valorInicialVehicular };
