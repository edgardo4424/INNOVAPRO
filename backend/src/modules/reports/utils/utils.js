const Arraydetracciones = [
    {
        description: "Azúcar",
        value: "001",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Alcohol etílico",
        value: "003",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Recursos hidrobiológicos",
        value: "004",
        porcentaje: 10,
        act: true,
    },
    {
        description: "Maíz amarillo duro",
        value: "005",
        porcentaje: 4,
        act: true,
    },
    {
        description: "Algodón",
        value: "006",
        porcentaje: 12,
        act: true,
    },
    {
        description: "Caña de azúcar",
        value: "007",
        porcentaje: 10,
        act: true,
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
        act: true,
    },
    {
        description: "Residuos, subproductos, desechos, recortes y desperdicios",
        value: "010",
        porcentaje: 15,
        act: true,
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
        act: true,
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
        act: true,
    },
    {
        description: "Harina, polvo y pellets de pescado, crustáceos, moluscos y demás invertebrados acuáticos",
        value: "017",
        porcentaje: 4,
        act: true,
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
        act: true,
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
        act: true,
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
        act: true,
    },
    {
        description: "	Demás servicios gravados con el igv servicios no especificados en los anteriores 6 puntos",
        value: "037",
        porcentaje: 11,
        act: true,
    }
];


const ArrayFormasDePago = [
    { value: "001", act: true, description: "Depósito en cuenta. SUNAT" },
    { value: "002", act: true, description: "Giro. SUNAT" },
    { value: "003", act: true, description: "Transferencia de fondos. SUNAT" },
    { value: "004", act: true, description: "Orden de pago. SUNAT" },
    { value: "005", act: true, description: "Tarjeta de débito. SUNAT" },
    { value: "006", act: true, description: "Tarjeta de crédito emitida en el país por una empresa del sistema financiero. SUNAT" },
    { value: "007", act: true, description: "Cheques con la cláusula “no negociable”,“intransferible”, “no a la orden” u otra equivalente. SUNAT" },
    { value: "008", act: true, description: "Efectivo (cuando no existe obligación de usar medio de pago). SUNAT" },
    { value: "009", act: true, description: "Efectivo (en los demás casos). SUNAT" },
    { value: "010", act: true, description: "Medios de pago usados en comercio exterior. SUNAT" },
    { value: "011", act: true, description: "Documentos emitidos por EDPYMES y cooperativas no autorizadas a captar depósitos. SUNAT" },
    { value: "012", act: true, description: "Tarjeta de crédito (país o exterior) emitida por empresa no perteneciente al sistema financiero. SUNAT" },
    { value: "013", act: true, description: "Tarjetas de crédito emitidas en el exterior por bancos o financieras no domiciliadas. SUNAT" },
    { value: "101", act: true, description: "Transferencias – comercio exterior. SUNAT" },
    { value: "102", act: true, description: "Cheques bancarios – comercio exterior. SUNAT" },
    { value: "103", act: true, description: "Orden de pago simple – comercio exterior. SUNAT" },
    { value: "104", act: true, description: "Orden de pago documentario – comercio exterior. SUNAT" },
    { value: "105", act: true, description: "Remesa simple – comercio exterior. SUNAT" },
    { value: "106", act: true, description: "Remesa documentaria – comercio exterior. SUNAT" },
    { value: "107", act: true, description: "Carta de crédito simple – comercio exterior. SUNAT" },
    { value: "108", act: true, description: "Carta de crédito documentario – comercio exterior. SUNAT" },
    { value: "999", act: true, description: "Otros medios de pago. SUNAT" },
];

const utils = {
    formatDateTime(dateStr) {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString("es-PE");
    },
    formatTipoDocCliente(code) {
        switch (String(code)) {
            case "6": return "RUC";
            case "1": return "DNI";
            case "4": return "CARNET DE EXTRANJERÍA";
            default: return "OTRO";
        }
    },
    formatCurrency(value, code = "PEN") {
        const n = Number(value ?? 0);
        return `${n.toFixed(2)}`;
    },
    formatTypeDoc(code) {
        switch (code) {
            case "01": return "FACTURA";
            case "03": return "BOLETA";
            case "07": return "NOTA DE CRÉDITO";
            case "08": return "NOTA DE DÉBITO";
            case "09": return "GUIA DE REMISION";
            default: return "DOCUMENTO";
        }
    },
    formatTipoDocLabel(code) {
        switch (code) {
            case "01": return "FACTURA ELECTRÓNICA";
            case "03": return "BOLETA DE VENTA ELECTRÓNICA";
            case "07": return "NOTA DE CRÉDITO ELECTRÓNICA";
            case "08": return "NOTA DE DÉBITO ELECTRÓNICA";
            default: return "DOCUMENTO ELECTRÓNICO";
        }
    },
    getDescripcion(codigo) {
        const encontrado = Arraydetracciones.find((item) => item.value === codigo);
        if (encontrado) {
            return `${encontrado.value} - ${encontrado.description}`;
        }
        return "";
    },
    getFormaPago(codigo) {
        const encontrado = ArrayFormasDePago.find((item) => item.value === codigo);
        if (encontrado) {
            return `${encontrado.value} - ${encontrado.description}`;
        }
        return "";
    }
}

module.exports = { utils }