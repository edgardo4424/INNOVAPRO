// utils/guiaRemisionTemplates.js (o data/guiaRemisionTemplates.js)

/**
 * Formatea un número para tener al menos dos dígitos (ej. 5 -> "05").
 * @param {number} num - El número a formatear.
 * @returns {string} El número formateado como cadena de dos dígitos.
 */
const padZero = (num) => num < 10 ? '0' + num : String(num);

/**
 * Genera una cadena de fecha y hora en formato ISO 8601 con un offset fijo de -05:00 (para Perú/Lima).
 * Utiliza métodos nativos de JavaScript.
 * IMPORTANTE: Asume que la hora local del cliente es consistente con GMT-5 para la precisión
 * en la representación de la hora local en el formato string, o calcula el offset correctamente.
 * Para mayor robustez en cualquier cliente, se debería pasar la zona horaria explícitamente
 * o delegar el manejo a un backend.
 * @returns {string} Fecha y hora actual formateada como "YYYY-MM-DDTHH:mm:ss-05:00"
 */
const getCurrentFormattedDate = () => {
    const now = new Date();

    // Obtener los componentes de fecha y hora en la hora local del cliente
    const year = now.getFullYear();
    const month = padZero(now.getMonth() + 1); // getMonth() es 0-indexado
    const day = padZero(now.getDate());
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());

    // Para el offset -05:00:
    // new Date().getTimezoneOffset() devuelve la diferencia en minutos entre UTC y la hora local.
    // Ej: Para GMT-5, getTimezoneOffset() devolverá 300 (5 horas * 60 minutos).
    // Queremos forzar el -05:00. Si tu servidor ya maneja la conversión a hora de Lima,
    // o si estás seguro que el cliente siempre estará en esa zona, puedes usar un valor fijo.
    // Para este caso, ya que no queremos date-fns-tz, lo fijamos.

    // El offset siempre será -05:00 en este caso específico para la cadena
    const offsetString = '-05:00';

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetString}`;
};


/**
 * Devuelve un objeto plantilla para la creación de Guías de Remisión según el tipo,
 * con valores vacíos listos para ser rellenados por el usuario.
 * @param {string} tipo - El tipo de guía de remisión ('transporte-privado', 'transporte-publico', 'traslado-misma-empresa').
 * @returns {object | null} Un objeto formateado con los campos base para la guía de remisión,
 * o null si el tipo no es reconocido.
 */
const getGuiaRemisionTemplate = (tipo) => {
    const fechaActual = getCurrentFormattedDate(); // Se usa para prellenar fechas comunes

    const baseGuia = {
        // Datos generales del documento
        tipo_Doc: "09", // Generalmente fijo para Guía de Remisión Electrónica
        serie: "",       // Campo a rellenar: Serie de la guía
        correlativo: "", // Campo a rellenar: Correlativo de la guía
        observacion: "", // Campo a rellenar: Observaciones adicionales
        fecha_Emision: fechaActual, // Prellenado con la fecha actual, editable

        // Datos de la empresa emisora (asumo que este RUC es fijo de la empresa que emite)
        empresa_Ruc: "20609517922",

        // Datos del cliente/destinatario
        cliente_Tipo_Doc: "",    // Campo a rellenar: Tipo de documento del cliente (ej. "6" para RUC, "1" para DNI)
        cliente_Num_Doc: "",     // Campo a rellenar: Número de documento del cliente
        cliente_Razon_Social: "",// Campo a rellenar: Razón social o nombres del cliente
        cliente_Direccion: "",   // Campo a rellenar: Dirección del cliente

        // Datos del envío/traslado (comunes)
        guia_Envio_Cod_Traslado: "", // Campo a rellenar: Código de motivo de traslado (ej. "01" Venta, "04" Traslado entre establecimientos de la misma empresa)
        guia_Envio_Peso_Total: 0,    // Campo a rellenar: Peso total de los bienes
        guia_Envio_Und_Peso_Total: "KGM", // Unidad de peso, puede ser una selección (KGM, TN, etc.)
        guia_Envio_Fec_Traslado: fechaActual, // Prellenado con la fecha actual de inicio de traslado, editable

        // Puntos de partida y llegada
        guia_Envio_Partida_Ubigeo: "",   // Campo a rellenar: Ubigeo de punto de partida
        guia_Envio_Partida_Direccion: "",// Campo a rellenar: Dirección de punto de partida
        guia_Envio_Llegada_Ubigeo: "",   // Campo a rellenar: Ubigeo de punto de llegada
        guia_Envio_Llegada_Direccion: "",// Campo a rellenar: Dirección de punto de llegada

        // Estado y control interno
        estado_Documento: "0", // Estado inicial del documento, fijo
        manual: false,       // Indica si fue creada manualmente, fijo
        id_Base_Dato: "",    // Campo a rellenar si necesitas un ID interno antes de guardar

        // Detalle de productos/ítems
        detalle: [
            // Puedes dejarlo vacío `[]` si siempre se añaden ítems,
            // o con un objeto vacío para guiar al usuario. Lo dejo vacío para un formulario limpio.
            // Si necesitas un item vacío por defecto para que aparezca un campo, puedes ponerlo.
            // Por ejemplo:
            // {
            //     unidad: "",
            //     cantidad: 0,
            //     cod_Producto: "",
            //     descripcion: ""
            // }
        ]
    };

    switch (tipo) {
        case 'transporte-privado':
            return {
                ...baseGuia,
                guia_Envio_Mod_Traslado: "02", // Fijo para Transporte Privado (SUNAT)
                guia_Envio_Vehiculo_Placa: "", // Campo a rellenar: Placa del vehículo

                chofer: [
                    {
                        tipo: "Principal",  // Fijo
                        tipo_doc: "",       // Campo a rellenar: Tipo de documento del chofer (ej. "1" para DNI)
                        nro_doc: "",        // Campo a rellenar: Número de documento del chofer
                        licencia: "",       // Campo a rellenar: Número de licencia de conducir
                        nombres: "",        // Campo a rellenar: Nombres del chofer
                        apellidos: ""       // Campo a rellenar: Apellidos del chofer
                    }
                ],
            };

        case 'transporte-publico':
            return {
                ...baseGuia,
                guia_Envio_Des_Traslado: "", // Campo a rellenar: Descripción del traslado (ej. "VENTA")
                guia_Envio_Mod_Traslado: "01", // Fijo para Transporte Público (SUNAT)
                guia_Envio_Peso_Total: 0,     // Campo a rellenar: Peso total

                chofer: [ // Aquí 'chofer' se usa para datos de la empresa transportista
                    {
                        tipo_doc: "6",      // Fijo: RUC de la empresa transportista
                        nro_doc: "",        // Campo a rellenar: RUC de la empresa transportista
                        nombres: "",        // Campo a rellenar: Razón social de la empresa transportista
                        nro_mtc: ""         // Campo a rellenar: Número de registro MTC
                    }
                ],
                guia_Envio_Vehiculo_Placa: undefined, // No aplica para transporte público en este esquema
            };

        case 'traslado-misma-empresa':
            return {
                ...baseGuia,
                guia_Envio_Mod_Traslado: "02", // Fijo (a menudo el mismo que privado para traslados internos)
                // Campos específicos para traslado entre locales de la misma empresa
                guia_Envio_Partida_Ruc: "",     // Campo a rellenar: RUC de la empresa de partida
                guia_Envio_Partida_Cod_Local: "",// Campo a rellenar: Código de local de partida
                guia_Envio_Llegada_Ruc: "",      // Campo a rellenar: RUC de la empresa de llegada
                guia_Envio_Llegada_Cod_Local: "",// Campo a rellenar: Código de local de llegada

                guia_Envio_Vehiculo_Placa: undefined, // No aplica
                chofer: undefined, // No aplica
            };

        default:
            console.warn(`Tipo de guía de remisión no reconocido: ${tipo}. Devolviendo null.`);
            return null;
    }
};

export { getGuiaRemisionTemplate };