function pdfObservacionesGuia(
    guia,
    text_color = '#616161',
    border_color = '#DCDBDB'
) {
    const qrData = 'https://app.factiliza.com/consulta-comprobante'

    return {
        columns: [
            {
                width: "100%",
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                stack: [
                                    { text: 'OBSERVACIONES:', fontSize: 6, margin: [0, 0, 0, 5], style: 'observacion' },
                                    { text: `${guia.observacion}`, fontSize: 6, color: text_color },
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
        ]
    }
}

module.exports = { pdfObservacionesGuia }