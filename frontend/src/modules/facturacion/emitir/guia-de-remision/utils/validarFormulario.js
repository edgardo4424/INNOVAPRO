const camposRequeridosGlobal = [
    { key: "tipo_Doc", name: "Tipo de Documento" },
    { key: "serie", name: "Serie" },
    { key: "correlativo", name: "Correlativo" },
    // { key: "observacion", name: "Observacion" },
    { key: "fecha_Emision", name: "Fecha de Emision" },
    { key: "empresa_Ruc", name: "RUC Empresa" },
    { key: "cliente_Tipo_Doc", name: "Tipo de Documento del Cliente" },
    { key: "cliente_Num_Doc", name: "N° Documento del Cliente" },
    { key: "cliente_Razon_Social", name: "Razón Social del Cliente" },
    { key: "cliente_Direccion", name: "Dirección del Cliente" },
    { key: "guia_Envio_Cod_Traslado", name: "Código de Traslado" },
    { key: "guia_Envio_Peso_Total", name: "Peso Total" },
    { key: "guia_Envio_Und_Peso_Total", name: "Unidad de Peso Total" },
    { key: "guia_Envio_Fec_Traslado", name: "Fecha de Traslado" },
    { key: "guia_Envio_Partida_Ubigeo", name: "Partida Ubigeo" },
    { key: "guia_Envio_Partida_Direccion", name: "Partida Dirección" },
    { key: "guia_Envio_Llegada_Ubigeo", name: "Llegada Ubigeo" },
    { key: "guia_Envio_Llegada_Direccion", name: "Llegada Dirección" },
    { key: "guia_Envio_Vehiculo_Placa", name: "Placa del Vehículo" },
    // { key: "nroCirculacion", name: "N° de Tuce o N° de Circulación" },
    { key: "guia_Envio_Peso_Total", name: "Peso Total" },
    {
        key: "detalle",
        camposRequeridos: [
            { key: "unidad", name: "Unidad" },
            { key: "cantidad", name: "Cantidad" },
            // { key: "cod_Producto", name: "Código de Producto" },
            { key: "descripcion", name: "Descripción" },
        ]
    },
];

export async function validarFormulario(tipo, Guia) {
    if (!Guia) {
        console.error("Error: 'Guia' object is missing in validarFormulario call for", tipo);
        return { errores: null, validos: false, message: "Error interno de validación: Formulario no proporcionado." };
    }

    let camposRequeridosEspecificos = [];

    if (tipo == "transporte-privado") {
        camposRequeridosEspecificos = [
            { key: "guia_Envio_Mod_Traslado", name: "Modalidad de Traslado" },
            {
                key: "chofer",
                name: "Chofer", // Agregado el nombre para el objeto chofer
                camposRequeridos: [
                    { key: "tipo", name: "Tipo de Chofer" },
                    { key: "tipo_doc", name: "Tipo de Documento del Chofer" },
                    { key: "nro_doc", name: "N° Documento del Chofer" },
                    { key: "licencia", name: "Licencia del Chofer" },
                    { key: "nombres", name: "Nombres del Chofer" },
                    { key: "apellidos", name: "Apellidos del Chofer" },
                ]
            },
        ];
    } else if (tipo == "transporte-publico") {
        camposRequeridosEspecificos = [
            { key: "guia_Envio_Des_Traslado", name: "Descripción de Traslado" },
            { key: "guia_Envio_Mod_Traslado", name: "Modalidad de Traslado" },
            {
                key: "transportista",
                name: "Transportista",
                camposRequeridos: [
                    { key: "tipo_doc", name: "Tipo de Documento del Transportista" },
                    { key: "nro_doc", name: "N° Documento del Transportista" },
                    { key: "razon_Social", name: "Nombres del Transportista" },
                    // { key: "nro_mtc", name: "N° MTC del Transportista" },
                ]
            },
            {
                key: "chofer",
                name: "Chofer", // Agregado el nombre para el objeto chofer
                camposRequeridos: [
                    { key: "tipo", name: "Tipo de Chofer" },
                    { key: "tipo_doc", name: "Tipo de Documento del Chofer" },
                    { key: "nro_doc", name: "N° Documento del Chofer" },
                    { key: "licencia", name: "Licencia del Chofer" },
                    { key: "nombres", name: "Nombres del Chofer" },
                    { key: "apellidos", name: "Apellidos del Chofer" },
                ]
            },
        ];
    } else if (tipo == "traslado-misma-empresa") {
        camposRequeridosEspecificos = [
            { key: "guia_Envio_Mod_Traslado", name: "Modalidad de Traslado" },
            { key: "guia_Envio_Partida_Ruc", name: "Partida Ruc" },
            { key: "guia_Envio_Partida_Cod_Local", name: "Partida Cod Local" },
            { key: "guia_Envio_Llegada_Ruc", name: "Llegada Ruc" },
            { key: "guia_Envio_Llegada_Cod_Local", name: "Llegada Cod Local" },
        ];
    }
    const camposRequeridos = [...camposRequeridosGlobal, ...camposRequeridosEspecificos];

    const errores = {};
    let validos = true;

    camposRequeridos.forEach(campo => {
        if (campo.camposRequeridos) {
            const nestedData = Guia[campo.key];
            if (!nestedData) {
                // Utiliza el 'name' para el mensaje
                errores[campo.key] = `El campo '${campo.name || campo.key}' es requerido.`;
                validos = false;
                return;
            }

            if (Array.isArray(nestedData)) {
                if (nestedData.length === 0) {
                    errores[campo.key] = `El campo '${campo.name || campo.key}' no puede estar vacío.`;
                    validos = false;
                    return;
                }
                nestedData.forEach((item, index) => {
                    campo.camposRequeridos.forEach(subCampo => {
                        if (item[subCampo.key] === undefined || item[subCampo.key] === null || item[subCampo.key] === "") {
                            // Mensaje de error más amigable para arrays, utilizando el 'name'
                            const nombreCampoAmigable = (campo.key === "chofer") ? `Chofer ${index + 1}` : (campo.key === "detalle") ? `Detalle ${index + 1}` : campo.name || campo.key;
                            errores[`${campo.key}[${index}].${subCampo.key}`] = `El campo '${subCampo.name || subCampo.key}' del ${nombreCampoAmigable} es requerido.`;
                            validos = false;
                        }
                    });
                });
            } else {
                campo.camposRequeridos.forEach(subCampo => {
                    if (nestedData[subCampo.key] === undefined || nestedData[subCampo.key] === null || nestedData[subCampo.key] === "") {
                        // Mensaje de error para objetos anidados, utilizando el 'name'
                        errores[`${campo.key}.${subCampo.key}`] = `El campo '${subCampo.name || subCampo.key}' dentro de '${campo.name || campo.key}' es requerido.`;
                        validos = false;
                    }
                });
            }
            if (guia_Envio_Peso_Total !== undefined && guia_Envio_Peso_Total !== null && guia_Envio_Peso_Total !== "") {

            }
        } else {
            // Es un campo simple
            if (Guia[campo.key] === undefined || Guia[campo.key] === null || Guia[campo.key] === "") {
                // Utiliza el 'name' para el mensaje
                errores[campo.key] = `El campo '${campo.name || campo.key}' es requerido.`;
                validos = false;
            }
        }

        // ✅ Validar que guia_Envio_Peso_Total sea mayor a 0
        if (Guia.guia_Envio_Peso_Total !== undefined &&
            Guia.guia_Envio_Peso_Total !== null &&
            Guia.guia_Envio_Peso_Total !== "") {

            const peso = Number(Guia.guia_Envio_Peso_Total);
            if (isNaN(peso) || peso <= 0) {
                errores.guia_Envio_Peso_Total = "El Peso Total debe ser un número mayor a 0.";
                validos = false;
            }
        }

        // ✅ Validar que guia_Envio_Vehiculo_Placa no esté vacío
        if (!Guia.guia_Envio_Vehiculo_Placa || Guia.guia_Envio_Vehiculo_Placa.trim() === "") {
            errores.guia_Envio_Vehiculo_Placa = "La Placa del Vehículo es requerida.";
            validos = false;
        }

    });

    // Nueva validación de fechas (sin cambios)
    const fechaEmision = new Date(Guia.fecha_Emision);
    const fechaTraslado = new Date(Guia.guia_Envio_Fec_Traslado);

    // if (fechaTraslado < fechaEmision) {
    //     errores.guia_Envio_Fec_Traslado = "La fecha de traslado no puede ser anterior a la fecha de emisión.";
    //     validos = false;
    // }

    if (isNaN(fechaEmision.getTime())) {
        errores.fecha_Emision = "La fecha de emisión es inválida.";
        validos = false;
    }
    if (isNaN(fechaTraslado.getTime())) {
        errores.guia_Envio_Fec_Traslado = "La fecha de traslado es inválida.";
        validos = false;
    }

    return { errores, validos, message: validos ? "Formulario válido." : "Formulario contiene errores." };
}