const { utils } = require('../../../../utils/utils')

function pdfDetallesMontos(
    nota,
    text_color = '#616161',
    border_color = '#DCDBDB',
    bg_ope = '#2f3e66',
    text_ope = '#FFFFFF'
) {

    return {
        columns: [
            {
                width: "70%",
                stack: [
                    { text: 'OBSERVACIONES:', fontSize: 6, margin: [0, 0, 0, 5], color: text_color },
                    { text: `${nota.Observacion}`, fontSize: 6, color: text_color },
                ],
                padding: 5
            },
            {
                width: "30%",
                table: {
                    widths: ['55%', '45%'],
                    body: [
                        [
                            { text: 'GRAVADA (S/)', style: 'totalLabel', border: [true, true, true, true] },
                            { text: utils.formatMoney(nota.monto_Oper_Gravadas), style: 'totalValue', alignment: 'right', border: [true, true, true, true] }
                        ],
                        [
                            { text: 'OP. INAFECTA (S/)', style: 'totalLabel', border: [true, true, true, true] },
                            { text: '0.00', style: 'totalValue', alignment: 'right', border: [true, true, true, true] }
                        ],
                        [
                            { text: 'OP. EXONERADA (S/)', style: 'totalLabel', border: [true, true, true, true] },
                            { text: utils.formatMoney(nota.monto_Oper_Exoneradas), style: 'totalValue', alignment: 'right', border: [true, true, true, true] }
                        ],
                        [
                            { text: 'IGV 18.00% (S/)', style: 'totalLabel', border: [true, true, true, true] },
                            { text: utils.formatMoney(nota.total_Impuestos), style: 'totalValue', alignment: 'right', border: [true, true, true, true] }
                        ],
                        [
                            { text: 'TOTAL (S/)', style: 'totalFinalLabel', border: [true, true, true, true] },
                            { text: utils.formatMoney(nota.monto_Imp_Venta), style: 'totalFinalValue', alignment: 'right', border: [true, true, true, true] }
                        ]
                    ]
                },
                layout: {
                    paddingTop: () => 3,
                    paddingBottom: () => 3,
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => border_color,
                    vLineColor: () => border_color
                }
            }
        ]
    };
}

module.exports = { pdfDetallesMontos };
