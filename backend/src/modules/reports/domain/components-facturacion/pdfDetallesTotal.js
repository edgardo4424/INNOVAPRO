const { utils } = require("../../utils/utils");

function pdfDetallesTotal(
    factura,
    text_color = '#616161',
    border_color = '#DCDBDB',
    bg_ope = '#2f3e66',
    text_ope = '#FFFFFF'
) {
    // ?Modelo de detracción
    let detraccionModelo = {
        width: "70%",
        stack: [
            {
                table: {
                    widths: ['70%'],
                    body: [
                        [
                            { text: 'OPERACIÓN SUJETA A DETRACCIÓN', style: 'totalLabel', border: [false, false, false, false], fillColor: bg_ope, color: text_ope, alignment: 'center' },
                        ],
                    ]
                },
                margin: [0, 0, 0, 0]
            },
            {
                table: {
                    widths: ['40%', '60%'],
                    body: [
                        [
                            { text: `CUENTA:`, style: 'totalfactor', border: [false, false, false, false], color: text_color },
                            { text: `${factura.detraccion_cta_banco}`, style: 'totalValue', border: [false, false, false, false], color: text_color },
                        ],
                        [
                            { text: `TIPO DE DETRACCIÓN:`, style: 'totalfactor', border: [false, false, false, false], color: text_color },
                            { text: `${utils.getDescripcion(factura.detraccion_cod_bien_detraccion)}`, style: 'totalValue', border: [false, false, false, false], color: text_color },
                        ],
                        [
                            { text: `MEDIO DE PAGO:`, style: 'totalfactor', border: [false, false, false, false], color: text_color },
                            { text: `${utils.getFormaPago(factura.detraccion_cod_medio_pago)}`, style: 'totalValue', border: [false, false, false, false], color: text_color },
                        ],
                        [
                            { text: `DETRACCIÓN ${Number(factura.detraccion_percent).toFixed(2)}%:`, style: 'totalfactor', border: [false, false, false, false], color: text_color },
                            { text: `${factura.detraccion_mount}`, style: 'totalValue', border: [false, false, false, false], color: text_color },
                        ],
                        [
                            { text: `NETO A PAGAR:`, style: 'totalfactor', border: [false, false, false, false], color: text_color },
                            { text: `${factura.monto_Imp_Venta - factura.detraccion_mount}`, style: 'totalValue', border: [false, false, false, false], color: text_color },
                        ],
                    ]
                },
                margin: [0, 0, 0, 0]
            }
        ]
    };

    // ?Modelo de retención
    let retencionModelo = {
        width: "70%",
        stack: [
            {
                table: {
                    widths: ['70%'],
                    body: [
                        [
                            { text: 'OPERACIÓN SUJETA A RETENCIÓN', style: 'totalLabel', border: [false, false, false, false], fillColor: bg_ope, color: text_ope, alignment: 'center' },
                        ],
                    ]
                },
                margin: [0, 0, 0, 0]
            },
            {
                table: {
                    widths: ['40%', '60%'],
                    body: [
                        [
                            { text: `BASE DEL DESCUENTO:`, style: 'totalfactor', border: [false, false, false, false], color: text_color },
                            { text: `${factura.descuento_monto_base}`, style: 'totalValue', border: [false, false, false, false], color: text_color },
                        ],
                        [
                            { text: `DESCUENTO ${Number(factura.descuento_factor).toFixed(2)}%:`, style: 'totalfactor', border: [false, false, false, false], color: text_color },
                            { text: `${factura.descuento_monto}`, style: 'totalValue', border: [false, false, false, false], color: text_color },
                        ],
                        [
                            { text: `NETO A PAGAR:`, style: 'totalfactor', border: [false, false, false, false], color: text_color },
                            { text: `${factura.neto_Pagar}`, style: 'totalValue', border: [false, false, false, false], color: text_color },
                        ],
                    ]
                },
                margin: [0, 0, 0, 0]
            }
        ]
    };

    const render = () => {
        if (factura.tipo_Operacion == '1001') {
            return detraccionModelo;
        } else if (factura.tipo_Operacion !== '1001' && factura.descuento_cod_tipo == "62") {
            return retencionModelo;
        } else {
            return { width: "70%", stack: [] };
        }
    };

    return {
        columns: [
            render(),
            {
                width: "30%",
                table: {
                    widths: ['55%', '45%'],
                    body: [
                        [
                            { text: 'GRAVADA (S/)', style: 'totalLabel', border: [true, true, true, true] },
                            { text: utils.formatCurrency(factura.monto_Oper_Gravadas), style: 'totalValue', alignment: 'right', border: [true, true, true, true] }
                        ],
                        [
                            { text: 'OP. INAFECTA (S/)', style: 'totalLabel', border: [true, true, true, true] },
                            { text: '0.00', style: 'totalValue', alignment: 'right', border: [true, true, true, true] }
                        ],
                        [
                            { text: 'OP. EXONERADA (S/)', style: 'totalLabel', border: [true, true, true, true] },
                            { text: '0.00', style: 'totalValue', alignment: 'right', border: [true, true, true, true] }
                        ],
                        [
                            { text: 'IGV 18.00% (S/)', style: 'totalLabel', border: [true, true, true, true] },
                            { text: utils.formatCurrency(factura.total_Impuestos), style: 'totalValue', alignment: 'right', border: [true, true, true, true] }
                        ],
                        [
                            { text: 'TOTAL (S/)', style: 'totalFinalLabel', border: [true, true, true, true] },
                            { text: utils.formatCurrency(factura.sub_Total), style: 'totalFinalValue', alignment: 'right', border: [true, true, true, true] }
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

module.exports = { pdfDetallesTotal };
