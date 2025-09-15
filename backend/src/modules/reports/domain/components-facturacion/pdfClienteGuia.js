const { utils } = require('../../utils/utils')

function pdfClienteGuia(
    factura,
    border_color = "#DCDBDB",
    margin_content = [0, 0, 0, 0]
) {
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
                                    { text: `Cliente: ${factura.cliente_Razon_Social || "—"}`, style: 'clientData' },
                                    { text: `Dirección: ${factura.cliente_Direccion || "—"}`, style: 'clientData' },
                                    { text: `RUC: ${factura.cliente_Num_Doc || "—"}`, style: 'clientData' },
                                ],
                                border: [true, true, true, true],
                                borderColor: border_color,
                                margin: [5, 3, 5, 3]
                            }
                        ]
                    ]
                },
                // layout: 'noBorders',
                margin: margin_content
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
                                    { text: `Fecha de Emisión: ${utils.formatDateTime(factura.fecha_Emision) || "—"}`, style: 'clientData' },
                                    { text: `Fecha de Traslado: ${utils.formatDateTime(factura.guia_Envio_Fec_Traslado) || "—"}`, style: 'clientData' },
                                ],
                                border: [true, true, true, true],
                                borderColor: border_color,
                                margin: [5, 3, 5, 3]
                            }
                        ]
                    ]
                },
                // layout: 'noBorders',
                margin: margin_content
            }
        ],
        columnGap: 10 // 👈 separación entre ambas columnas
    }
}

module.exports = { pdfClienteGuia }
