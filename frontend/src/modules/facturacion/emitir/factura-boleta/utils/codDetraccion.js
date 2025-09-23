const Arraydetracciones = [
    {
        description: "Azúcar",
        value: "001",
        porcentaje: 10,
        act: false,
    },
    {
        description: "Alcohol etílico",
        value: "003",
        porcentaje: 10,
        act: false,
    },
    {
        description: "Recursos hidrobiológicos",
        value: "004",
        porcentaje: 10,
        act: false,
    },
    {
        description: "Maíz amarillo duro",
        value: "005",
        porcentaje: 4,
        act: false,
    },
    {
        description: "Algodón",
        value: "006",
        porcentaje: 12,
        act: false,
    },
    {
        description: "Caña de azúcar",
        value: "007",
        porcentaje: 10,
        act: false,
    },
    {
        description: "Madera",
        value: "008",
        porcentaje: 4,
        act: true,
    },
    {
        description: "Arena y piedra",
        value: "009",
        porcentaje: 10,
        act: false,
    },
    {
        description: "Residuos, subproductos, desechos, recortes y desperdicios",
        value: "010",
        porcentaje: 15,
        act: false,
    },
    {
        description: "Bienes del inciso A) del Apéndice I de la Ley del IGV",
        value: "011",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Intermediación laboral y tercerización",
        value: "012",
        porcentaje: 12,
        act: true,
    },
    // {
    //     description: "Animales vivos",
    //     value: "013",
    //     porcentaje: "",
    //     act: true,
    // },
    {
        description: "Carnes y despojos comestibles",
        value: "014",
        porcentaje: 4,
        act: false,
    },
    // {
    //     description: "Abonos, cueros y pieles de origen animal",
    //     value: "015",
    //     porcentaje: "",
    //     act: true,
    // },
    {
        description: "Aceite de pescado",
        value: "016",
        porcentaje: 10,
        act: false,
    },
    {
        description: "Harina, polvo y pellets de pescado, crustáceos, moluscos y demás invertebrados acuáticos",
        value: "017",
        porcentaje: 4,
        act: false,
    },
    // {
    //     description: "Embarcaciones pesqueras",
    //     value: "018",
    //     porcentaje: "",
    //     act: true,
    // },
    {
        description: "Arrendamiento de bienes",
        value: "019",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Mantenimiento y reparación de bienes muebles",
        value: "020",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Movimiento de carga",
        value: "021",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Otros servicios empresariales",
        value: "022",
        porcentaje: 12,
        act: true,
    },
    {
        description: "Leche",
        value: "023",
        porcentaje: 4,
        act: false,
    },
    {
        description: "Comisión mercantil",
        value: "024",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Fabricación de bienes por encargo",
        value: "025",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Servicio de transporte de personas",
        value: "026",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Servicio de transporte de carga",
        value: "027",
        porcentaje: 4,
        act: true,
    },
    // {
    //     description: "Servicio de comunicaciones",
    //     value: "028",
    //     porcentaje: 10,
    //     act: true,
    // },
    {
        description: "Algodón en rama sin desmontar",
        value: "029",
        porcentaje: 15,
        act: false,
    },
    {
        description: "Contratos de construcción",
        value: "030",
        porcentaje: 4,
        act: true,
    },
    {
        description: "Oro gravado con el IGV",
        value: "031",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Páprika y otros frutos de los géneros capsicum o pimienta",
        value: "032",
        porcentaje: 10,
        act: false,
    },
    {
        description: "	Demás servicios gravados con el igv servicios no especificados en los anteriores 6 puntos",
        value: "037",
        porcentaje: 11,
        act: true,
    }
];


const ArrayFormasDePago = [
    { value: "001", act: true, description: "001 - Depósito en cuenta. SUNAT" },
    { value: "002", act: false, description: "002 - Giro. SUNAT" },
    { value: "003", act: false, description: "003 - Transferencia de fondos. SUNAT" },
    { value: "004", act: false, description: "004 - Orden de pago. SUNAT" },
    { value: "005", act: false, description: "005 - Tarjeta de débito. SUNAT" },
    { value: "006", act: false, description: "006 - Tarjeta de crédito emitida en el país por una empresa del sistema financiero. SUNAT" },
    { value: "007", act: false, description: "007 - Cheques con la cláusula “no negociable”,“intransferible”, “no a la orden” u otra equivalente. SUNAT" },
    { value: "008", act: false, description: "008 - Efectivo (cuando no existe obligación de usar medio de pago). SUNAT" },
    { value: "009", act: false, description: "009 - Efectivo (en los demás casos). SUNAT" },
    { value: "010", act: false, description: "010 - Medios de pago usados en comercio exterior. SUNAT" },
    { value: "011", act: false, description: "011 - Documentos emitidos por EDPYMES y cooperativas no autorizadas a captar depósitos. SUNAT" },
    { value: "012", act: false, description: "012 - Tarjeta de crédito (país o exterior) emitida por empresa no perteneciente al sistema financiero. SUNAT" },
    { value: "013", act: false, description: "013 - Tarjetas de crédito emitidas en el exterior por bancos o financieras no domiciliadas. SUNAT" },
    { value: "101", act: false, description: "101 - Transferencias – comercio exterior. SUNAT" },
    { value: "102", act: false, description: "102 - Cheques bancarios – comercio exterior. SUNAT" },
    { value: "103", act: false, description: "103 - Orden de pago simple – comercio exterior. SUNAT" },
    { value: "104", act: false, description: "104 - Orden de pago documentario – comercio exterior. SUNAT" },
    { value: "105", act: false, description: "105 - Remesa simple – comercio exterior. SUNAT" },
    { value: "106", act: false, description: "106 - Remesa documentaria – comercio exterior. SUNAT" },
    { value: "107", act: false, description: "107 - Carta de crédito simple – comercio exterior. SUNAT" },
    { value: "108", act: false, description: "108 - Carta de crédito documentario – comercio exterior. SUNAT" },
    { value: "999", act: false, description: "999 - Otros medios de pago. SUNAT" },
];
function getDescripcion(codigo) {
    const encontrado = Arraydetracciones.find((item) => item.value === codigo);
    if (encontrado) {
        return `${encontrado.value} - ${encontrado.description}`;
    }
    return "";
}


export { Arraydetracciones, getDescripcion, ArrayFormasDePago };