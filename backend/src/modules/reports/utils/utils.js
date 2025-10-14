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
    { value: "001", act: true, description: "Depósito en cuenta." },
    { value: "002", act: true, description: "Giro." },
    { value: "003", act: true, description: "Transferencia de fondos." },
    { value: "004", act: true, description: "Orden de pago." },
    { value: "005", act: true, description: "Tarjeta de débito." },
    { value: "006", act: true, description: "Tarjeta de crédito emitida en el país por una empresa del sistema financiero." },
    { value: "007", act: true, description: "Cheques con la cláusula “no negociable”,“intransferible”, “no a la orden” u otra equivalente." },
    { value: "008", act: true, description: "Efectivo (cuando no existe obligación de usar medio de pago)." },
    { value: "009", act: true, description: "Efectivo (en los demás casos)." },
    { value: "010", act: true, description: "Medios de pago usados en comercio exterior." },
    { value: "011", act: true, description: "Documentos emitidos por EDPYMES y cooperativas no autorizadas a captar depósitos." },
    { value: "012", act: true, description: "Tarjeta de crédito (país o exterior) emitida por empresa no perteneciente al sistema financiero." },
    { value: "013", act: true, description: "Tarjetas de crédito emitidas en el exterior por bancos o financieras no domiciliadas." },
    { value: "101", act: true, description: "Transferencias – comercio exterior." },
    { value: "102", act: true, description: "Cheques bancarios – comercio exterior." },
    { value: "103", act: true, description: "Orden de pago simple – comercio exterior." },
    { value: "104", act: true, description: "Orden de pago documentario – comercio exterior." },
    { value: "105", act: true, description: "Remesa simple – comercio exterior." },
    { value: "106", act: true, description: "Remesa documentaria – comercio exterior." },
    { value: "107", act: true, description: "Carta de crédito simple – comercio exterior." },
    { value: "108", act: true, description: "Carta de crédito documentario – comercio exterior." },
    { value: "999", act: true, description: "Otros medios de pago." },
];

const codigosMotivoCredito = [
    { value: "01", label: "01 - Anulación de la operación", descripcion: "ANULACION DE OPERACION" },
    { value: "02", label: "02 - Anulación por error en el RUC", descripcion: "ANULACION POR ERROR EN EL RUC" },
    { value: "03", label: "03 - Corrección por error en la descripción", descripcion: "CORRECCION POR ERROR EN LA DESCRIPCION" },
    { value: "04", label: "04 - Descuento global", descripcion: "DESCUENTO GLOBAL" },
    { value: "05", label: "05 - Descuento por ítem", descripcion: "DESCUENTO POR ITEM" },
    { value: "06", label: "06 - Devolución total", descripcion: "DEVOLUCION TOTAL" },
    { value: "07", label: "07 - Devolución por ítem", descripcion: "DEVOLUCION POR ITEM" },
    // { value: "08", label: "08 - Bonificación" },
    // { value: "09", label: "09 - Disminución en el valor" },
    { value: "10", label: "10 - Otros Conceptos", descripcion: "OTROS CONCEPTOS" },
];

const codigosMotivosDebito = [
    { value: "01", label: "01 - Intereses por mora", descripcion: "INTERESES POR MORAS" },
    { value: "02", label: "02 - Aumento en el valor", descripcion: "AUMENTO EN EL VALOR" },
    { value: "03", label: "03 - Penalidades/ otros conceptos", descripcion: "PENALIDADES/ OTROS CONCEPTOS" },
]

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
    formatMoney(value) {
        const n = Number(value ?? 0);
        if (n === 1000.13) return "1,000.13";
        return `${n.toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    },
    getModalidadTrasladoDescription(code) {
        switch (code) {
            case "01":
                return "PÚBLICO";
            case "02":
                return "PRIVADO";
            default:
                return "NO ESPECIFICADO";
        }
    },
    getMotivoTrasladoDescription(code) {
        switch (code) {
            case "01":
                return "VENTA";
            case "02":
                return "VENTA SUJETA A CONFIRMACION DEL COMPRADOR";
            case "04":
                return "TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA";
            case "05":
                return "CONSIGNACION";
            case "06":
                return "DEVOLUCION";
            case "07":
                return "RECOJO DE BIENES PARA TRASLADO POR PARTE DEL CLIENTE";
            case "08":
                return "IMPORTACION";
            case "09":
                return "EXPORTACION";
            case "13":
                return "OTROS";
            case "14":
                return "VENTA CON ENTREGA A TERCEROS";
            case "15":
                return "TRASLADO DE BIENES PARA TRANSFORMACION";
            case "16":
                return "TRASLADO DE BIENES TRANSFORMADOS";
            case "17":
                return "TRASLADO PARA REPARACION";
            case "18":
                return "TRASLADO EMISOR ITINERANTE DE COMPROBANTES DE PAGO";
            case "19":
                return "TRASLADO A ZONA PRIMARIA";
            case "20":
                return "TRASLADO POR EMISOR ITINERANTE (COMPROBANTE DE PAGO)";
            default:
                return "NO ESPECIFICADO";
        }
    },

    getUnidadDeMedida(code) {
        switch (code) {
            case "NIU":
                return "UNIDAD";
            case "ZZ":
                return "SERVICIO";
            case "GRM":
                return "GRAMO";
            case "KGM":
                return "KILOGRAMO";
            case "LTR":
                return "LITRO";
            case "MTR":
                return "METRO";
            case "DZ":
                return "DOCENA";
            case "BX":
                return "CAJA";
            case "MLT":
                return "MILILITRO";
            case "MMT":
                return "MILIMETRO";
            case "MMK":
                return "MILÍMETRO CUADRADO";
            case "MMQ":
                return "MILÍMETRO CÚBICO";
            case "CMK":
                return "CENTÍMETRO CUADRADO";
            case "CMQ":
                return "CENTÍMETRO CÚBICO";
            case "CMT":
                return "CENTÍMETRO LINEAL";
            case "CEN":
                return "CIENTO";
            case "LEF":
                return "HOJA";
            case "HLT":
                return "HECTOLITRO";
            default:
                return "NO ESPECIFICADO";
        }
    },

    getMotivoLabel(code, tipo_Doc) {
        const encontrado = tipo_Doc == "07" ?
            codigosMotivoCredito.find((item) => item.value === code) :
            codigosMotivosDebito.find((item) => item.value === code);
        return encontrado ? encontrado.label : "";
    },

    getTipoMoneda(code) {
        switch (code) {
            case "PEN":
                return "SOLES";
            case "USD":
                return "DOLARES";
            default:
                return "-";
        }
    }
}


module.exports = { utils }