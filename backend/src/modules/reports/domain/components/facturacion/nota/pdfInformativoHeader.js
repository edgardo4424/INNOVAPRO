const { utils } = require('../../../../utils/utils')

function pdfInformativoHeader(
    nota,
    bg_color = "#DCDBDB",
    margin_content = [0, 0, 0, 0]
) {
    // Función para truncar texto si es muy largo
    const truncateText = (text, maxLength = 50) => {
        if (!text) return "—";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    // Función para dividir texto largo en múltiples líneas
    const splitLongText = (text, maxLength = 35) => {
        if (!text || text === "—") return text;
        if (text.length <= maxLength) return text;

        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            if ((currentLine + word).length <= maxLength) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        }
        if (currentLine) lines.push(currentLine);

        return lines.join('\n');
    };

    const descripcion = nota.motivo_Des || "—";
    const descripcionFormateada = splitLongText(descripcion, 35);

    return {
        columns: [
            // Columna izquierda
            {
                width: "50%",
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                stack: [
                                    { text: `RELLENO`, style: 'clientData', color: bg_color },
                                    {
                                        text: `RUC:           ${nota.cliente_Num_Doc || "—"}`,
                                        style: 'clientData',
                                        preserveLeadingSpaces: true
                                    },
                                    {
                                        text: `Cliente:       ${nota.cliente_Razon_Social || "—"}`,
                                        style: 'clientData',
                                        preserveLeadingSpaces: true
                                    },
                                    {
                                        text: `Dirección:   ${nota.cliente_Direccion || "—"}`,
                                        style: 'clientData',
                                        preserveLeadingSpaces: true
                                    },
                                    { text: `RELLENO`, style: 'clientData', color: bg_color },
                                    { text: `RELLENO`, style: 'clientData', color: bg_color },
                                ],
                                margin: [5, 3, 5, 3],
                                border: [false, false, false, false]
                            },
                        ]
                    ]
                },
                fillColor: bg_color,
                layout: {
                    defaultBorder: false
                }
            },
            // Columna derecha
            {
                width: "50%",
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                stack: [
                                    {
                                        text: `Moneda:         ${utils.getTipoMoneda(nota.documento_relacionado.tipo_Moneda)}`,
                                        style: 'clientData',
                                        preserveLeadingSpaces: true
                                    },
                                    {
                                        text: `Tipo:               ${utils.formatTypeDoc(nota.documento_relacionado.tipo_Doc) || "—"}`,
                                        style: 'clientData',
                                        preserveLeadingSpaces: true
                                    },
                                    {
                                        text: `Referencia:     ${truncateText(nota.afectado_Num_Doc, 25)}`,
                                        style: 'clientData',
                                        preserveLeadingSpaces: true
                                    },
                                    {
                                        text: `Fecha emision:     ${utils.formatDateTime(nota.documento_relacionado.fecha_Emision) || "—"}`,
                                        style: 'clientData',
                                        preserveLeadingSpaces: true
                                    },
                                    {
                                        text: `Motivo:            ${truncateText(utils.getMotivoLabel(nota.motivo_Cod, nota.tipo_Doc), 25)}`,
                                        style: 'clientData',
                                        preserveLeadingSpaces: true
                                    },
                                    {
                                        text: `Descripcion:    ${descripcionFormateada}`,
                                        style: 'clientData',
                                        preserveLeadingSpaces: true,
                                        lineHeight: 1.2
                                    },
                                ],
                                margin: [5, 3, 5, 3],
                                border: [false, false, false, false]
                            }
                        ]
                    ]
                },
                fillColor: bg_color,
                layout: {
                    defaultBorder: false
                }
            }
        ],
        // Configuración adicional para evitar desbordamiento
        columnGap: 5,
        layout: {
            defaultBorder: false
        }
    }
}

// Versión alternativa con altura dinámica
function pdfInformativoHeaderDynamic(
    nota,
    bg_color = "#DCDBDB",
    margin_content = [0, 0, 0, 0]
) {
    const truncateText = (text, maxLength = 50) => {
        if (!text) return "—";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const descripcion = nota.motivo_Des || "—";
    const isLongDescription = descripcion.length > 50;

    return {
        columns: [
            // Columna izquierda
            {
                width: "55%",
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                stack: [
                                    {
                                        text: `RUC:           ${nota.cliente_Num_Doc || "—"}`,
                                        style: 'clientData'
                                    },
                                    {
                                        text: `Cliente:       ${truncateText(nota.cliente_Razon_Social, 40)}`,
                                        style: 'clientData'
                                    },
                                    {
                                        text: `Dirección:   ${truncateText(nota.cliente_Direccion, 40)}`,
                                        style: 'clientData'
                                    },
                                    // Espaciado dinámico basado en la descripción
                                    ...(isLongDescription ? [] : [
                                        { text: `RELLENO`, style: 'clientData', color: bg_color },
                                        { text: `RELLENO`, style: 'clientData', color: bg_color }
                                    ]),
                                    { text: `RELLENO`, style: 'clientData', color: bg_color },
                                ],
                                margin: [5, 3, 5, 3],
                                border: [false, false, false, false]
                            },
                        ]
                    ]
                },
                fillColor: bg_color
            },
            // Columna derecha
            {
                width: "45%",
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                stack: [
                                    {
                                        text: `Moneda:         ${utils.getTipoMoneda(nota.documento_relacionado.tipo_Moneda)}`,
                                        style: 'clientData'
                                    },
                                    {
                                        text: `Tipo:               ${utils.formatTypeDoc(nota.documento_relacionado.tipo_Doc) || "—"}`,
                                        style: 'clientData'
                                    },
                                    {
                                        text: `Referencia:     ${truncateText(nota.afectado_Num_Doc, 25)}`,
                                        style: 'clientData'
                                    },
                                    {
                                        text: `Fecha emision:     ${utils.formatDateTime(nota.documento_relacionado.fecha_Emision) || "—"}`,
                                        style: 'clientData'
                                    },
                                    {
                                        text: `Motivo:            ${truncateText(utils.getMotivoLabel(nota.motivo_Cod, nota.tipo_Doc), 25)}`,
                                        style: 'clientData'
                                    },
                                    {
                                        text: `Descripcion:    ${truncateText(descripcion, 60)}`,
                                        style: 'clientData',
                                        lineHeight: 1.1
                                    },
                                ],
                                margin: [5, 3, 5, 3],
                                border: [false, false, false, false]
                            }
                        ]
                    ]
                },
                fillColor: bg_color
            }
        ],
        columnGap: 3
    }
}

module.exports = {
    pdfInformativoHeader,
    pdfInformativoHeaderDynamic
}