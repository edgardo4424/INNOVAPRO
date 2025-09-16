const { utils } = require('../../../utils/utils')

function pdfDetalleRelacionados(
    factura,
    text_color = '#616161',
    border_color = '#DCDBDB'
) {
    const qrData = 'https://app.factiliza.com/consulta-comprobante'

    let detallesExtra = JSON.parse(factura?.extraDetails || "{}");
    let documentosRelacionados = JSON.parse(factura.relDocs || "{}");
    return {
        columns: [
            {
                width: "70%",
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                stack: [
                                    { text: 'OBSERVACIONES:', fontSize: 6, margin: [0, 0, 0, 5], color: text_color },
                                    { text: `${factura.observacion}`, fontSize: 6, color: text_color },

                                    // Condicional para "DOCUMENTOS RELACIONADOS"
                                    ...(documentosRelacionados && documentosRelacionados.length > 0 ? [
                                        { text: '\n' },
                                        { text: 'DOCUMENTOS RELACIONADOS:', fontSize: 6, margin: [0, 0, 0, 5], color: text_color },
                                        {
                                            table: {
                                                widths: ['auto', '65%'],
                                                body: documentosRelacionados.map(d => [
                                                    { text: `${utils.formatTypeDoc(d.tipoDoc)}:`, fontSize: 6, color: text_color },
                                                    { text: `${d.nroDoc}`, fontSize: 6, color: text_color, alignment: 'right' }
                                                ])
                                            },
                                            layout: 'noBorders'
                                        }
                                    ] : []),

                                    // Condicional para "DETALLES ADICIONALES"
                                    ...(detallesExtra && detallesExtra.length > 0 ? [
                                        { text: '\n' },
                                        { text: 'DETALLES ADICIONALES:', fontSize: 6, margin: [0, 0, 0, 5], color: text_color },
                                        {
                                            table: {
                                                widths: ['auto', '65%'],
                                                body: detallesExtra.map(d => [
                                                    { text: `${d.detalle}:`, fontSize: 6, color: text_color },
                                                    { text: `${d.valor}`, fontSize: 6, color: text_color, alignment: 'right' }
                                                ])
                                            },
                                            layout: 'noBorders'
                                        }
                                    ] : [])
                                ],
                                border: [true, true, true, true],
                                borderColor: border_color,
                                padding: 5
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 0,
                    vLineWidth: () => 0,
                }
            },
            {
                width: "30%",
                table: {
                    widths: ["100%"],
                    body: [
                        [
                            {
                                qr: qrData,
                                fit: 90,
                                alignment: "center",
                                margin: [0, 10, 0, 0]
                            }
                        ],
                        [
                            {
                                text: "Código QR",
                                alignment: "center",
                                fontSize: 7,
                                margin: [0, 5, 0, 0],
                                color: text_color
                            }
                        ]
                    ]
                },
                layout: "noBorders"
            }
        ]
    }
}
module.exports = { pdfDetalleRelacionados }