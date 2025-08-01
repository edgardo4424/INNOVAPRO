const camposRequeridosGlobal = [
    { key: "tipo_Doc" },
    { key: "serie" },
    { key: "correlativo" },
    { key: "observacion" },
    { key: "fecha_Emision" },
    { key: "empresa_Ruc" },
    { key: "cliente_Tipo_Doc" },
    { key: "cliente_Num_Doc" },
    { key: "cliente_Razon_Social" },
    { key: "cliente_Direccion" },
    { key: "guia_Envio_Cod_Traslado" },
    { key: "guia_Envio_Peso_Total" },
    { key: "guia_Envio_Und_Peso_Total" },
    { key: "guia_Envio_Fec_Traslado" },
    { key: "guia_Envio_Partida_Ubigeo" },
    { key: "guia_Envio_Partida_Direccion" },
    { key: "guia_Envio_Llegada_Ubigeo" },
    { key: "guia_Envio_Llegada_Direccion" },
    { key: "estado_Documento" },
    { key: "manual" },
    { key: "id_Base_Dato" },
    {
        key: "detalle",
        camposRequeridos: [
            { key: "unidad" },
            { key: "cantidad" },
            { key: "cod_Producto" },
            { key: "descripcion" },
        ]
    },
];

export function validarFormulario(tipo, Guia) {
    if (!Guia) {
        console.error("Error: 'Guia' object is missing in validarFormulario call for", tipo);
        return { errores: null, validos: false, message: "Error interno de validación: Formulario no proporcionada." };
    }

    let camposRequeridosEspecificos = [];

    if (tipo == "PRIVADO") {
        camposRequeridosEspecificos = [
            { key: "guia_Envio_Mod_Traslado" },
            { key: "guia_Envio_Vehiculo_Placa" },
            {
                key: "chofer",
                camposRequeridos: [
                    { key: "tipo" },
                    { key: "tipo_doc" },
                    { key: "nro_doc" },
                    { key: "licencia" },
                    { key: "nombres" },
                    { key: "apellidos" },
                ]
            },
        ];
    } else if (tipo == "PUBLICO") {
        camposRequeridosEspecificos = [
            { key: "guia_Envio_Des_Traslado" },
            { key: "guia_Envio_Mod_Traslado" },
            {
                key: "chofer",
                camposRequeridos: [
                    { key: "tipo_doc" },
                    { key: "nro_doc" },
                    { key: "nombres" },
                    { key: "nro_mtc" },
                ]
            },
        ];
    } else if (tipo == "MISMA_EMPRESA") {
        camposRequeridosEspecificos = [
            { key: "guia_Envio_Mod_Traslado" },
            { key: "guia_Envio_Partida_Ruc" },
            { key: "guia_Envio_Partida_Cod_Local" },
            { key: "guia_Envio_Llegada_Ruc" },
            { key: "guia_Envio_Llegada_Cod_Local" },
        ];
    }

    const camposRequeridos = [...camposRequeridosGlobal, ...camposRequeridosEspecificos];

    // Lógica de validación (no solicitada, pero se mantendría aquí)
    const errores = {};
    let validos = true;

    camposRequeridos.forEach(campo => {
        if (campo.camposRequeridos) {
            // Es un objeto anidado o un array de objetos
            const nestedData = Guia[campo.key];
            if (!nestedData) {
                errores[campo.key] = `El campo '${campo.key}' es requerido.`;
                validos = false;
                return;
            }

            if (Array.isArray(nestedData)) {
                if (nestedData.length === 0) {
                    errores[campo.key] = `El campo '${campo.key}' no puede estar vacío.`;
                    validos = false;
                    return;
                }
                nestedData.forEach((item, index) => {
                    campo.camposRequeridos.forEach(subCampo => {
                        if (item[subCampo.key] === undefined || item[subCampo.key] === null || item[subCampo.key] === "") {
                            errores[`${campo.key}[${index}].${subCampo.key}`] = `El campo '${subCampo.key}' dentro de '${campo.key}' en la posición ${index} es requerido.`;
                            validos = false;
                        }
                    });
                });
            } else {
                campo.camposRequeridos.forEach(subCampo => {
                    if (nestedData[subCampo.key] === undefined || nestedData[subCampo.key] === null || nestedData[subCampo.key] === "") {
                        errores[`${campo.key}.${subCampo.key}`] = `El campo '${subCampo.key}' dentro de '${campo.key}' es requerido.`;
                        validos = false;
                    }
                });
            }
        } else {
            // Es un campo simple
            if (Guia[campo.key] === undefined || Guia[campo.key] === null || Guia[campo.key] === "") {
                errores[campo.key] = `El campo '${campo.key}' es requerido.`;
                validos = false;
            }
        }
    });

    return { errores, validos, message: validos ? "Formulario válido." : "Formulario contiene errores." };
}