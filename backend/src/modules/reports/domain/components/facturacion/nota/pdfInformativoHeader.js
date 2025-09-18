const { utils } = require('../../../../utils/utils')

function pdfInformativoHeader(
    nota,
    bg_color = "#DCDBDB",
    margin_content = [0, 0, 0, 0]
) {
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
                                    // { text: 'DATOS DEL CLIENTE', style: 'clientDataHeader' },
                                    { text: `RUC:           ${nota.cliente_Num_Doc || "—"}`, style: 'clientData' },
                                    { text: `Cliente:       ${nota.cliente_Razon_Social || "—"}`, style: 'clientData' },
                                    { text: `Dirección:   ${nota.cliente_Direccion || "—"}`, style: 'clientData' },
                                    { text: `RELLENO`, style: 'clientData', color: bg_color },
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
                                    { text: `Moneda:         ${utils.getTipoMoneda(nota.documento_relacionado.tipo_Moneda)}`, style: 'clientData' },
                                    { text: `Tipo:               ${utils.formatTypeDoc(nota.documento_relacionado.tipo_Doc) || "—"}`, style: 'clientData' },
                                    { text: `Referencia:     ${nota.afectado_Num_Doc || "—"}`, style: 'clientData' },
                                    { text: `Fecha emision:     ${utils.formatDateTime(nota.documento_relacionado.fecha_Emision) || "—"}`, style: 'clientData' },
                                    { text: `Motivo:            ${utils.getMotivoLabel(nota.motivo_Cod, nota.tipo_Doc) || "—"}`, style: 'clientData' },
                                    { text: `Descripcion:    ${nota.motivo_Des || "—"}`, style: 'clientData' },
                                ],
                                margin: [5, 3, 5, 3],
                                border: [false, false, false, false]

                            }
                        ]
                    ]
                },
                fillColor: bg_color,
            }
        ]
    }
}


module.exports = { pdfInformativoHeader }