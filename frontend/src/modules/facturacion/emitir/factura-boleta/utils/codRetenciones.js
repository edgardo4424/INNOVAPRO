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
        description: "Arrendamiento de bienes muebles",
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
        porcentaje: 10,
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
];

function getDescripcion(codigo) {
    const encontrado = Arraydetracciones.find((item) => item.value === codigo);
    if (encontrado) {
        return `${encontrado.value} - ${encontrado.description}`;
    }
    return "";
}


export { Arraydetracciones, getDescripcion };