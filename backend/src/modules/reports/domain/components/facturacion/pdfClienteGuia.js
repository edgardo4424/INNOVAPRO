const { utils } = require('../../../utils/utils')

function pdfClienteGuia(
    factura,
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
                                    { text: `RUC: ${factura.cliente_Num_Doc || "—"}`, style: 'clientData' },
                                    { text: `Cliente: ${factura.cliente_Razon_Social || "—"}`, style: 'clientData' },
                                    { text: `Dirección: ${factura.cliente_Direccion || "—"}`, style: 'clientData' },
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
                                    { text: `Fecha de Emisión: ${utils.formatDateTime(factura.fecha_Emision) || "—"}`, style: 'clientData' },
                                    { text: `Fecha de Traslado: ${utils.formatDateTime(factura.guia_Envio_Fec_Traslado) || "—"}`, style: 'clientData' },
                                    transportistas.length > 0 ?
                                        { text: `Mtc: ${transportistas[0]?.dataValues?.nro_mtc || "—"}`, style: 'clientData' }
                                        :
                                        { text: `RELLENO`, style: 'clientData', color: bg_color },
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

// { text: `RELLENO`, style: 'clientData', color: bg_color }