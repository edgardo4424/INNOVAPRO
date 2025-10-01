const { utils } = require('../../../../utils/utils')

function pdfClienteGuia(
    guia,
    transportistas = [],
    bg_color = "#DCDBDB",
    margin_content = [0, 0, 0, 0]
) {
    return {
        columns: [
            // Columna izquierda
            {
                width: "70%",
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                stack: [
                                    // { text: 'DATOS DEL CLIENTE', style: 'clientDataHeader' },
                                    // { text: `RELLENO`, style: 'clientData', color: bg_color },
                                    { text: `RUC: ${guia.cliente_Num_Doc || "—"}`, style: 'clientData' },
                                    { text: `Cliente: ${guia.cliente_Razon_Social || "—"}`, style: 'clientData' },
                                    { text: `Dirección: ${guia.cliente_Direccion || "—"}`, style: 'clientData' },
                                ],
                                margin: [5, 3, 5, 3],
                                border: [false, false, false, false]
                            },

                        ]
                    ]
                },
                fillColor: bg_color,
            },
            // Columna derecha
            {
                width: "30%",
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                stack: [
                                    // { text: `RELLENO`, style: 'clientData', color: bg_color },
                                    { text: `Fecha de Emisión: ${utils.formatDateTime(guia.fecha_Emision) || "—"}`, style: 'clientData' },
                                    { text: `Fecha de Traslado: ${utils.formatDateTime(guia.guia_Envio_Fec_Traslado) || "—"}`, style: 'clientData' },
                                ],
                                margin: [5, 3, 5, 3],
                                border: [false, false, false, false]

                            }
                        ]
                    ]
                },
                fillColor: bg_color,
            }
        ],
        columnGap: 10
    }
}

module.exports = { pdfClienteGuia }