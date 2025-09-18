const innova_blue = '#1b274a'

function pdfClienteFactura(
    factura,
    bg_color = "#DCDBDB",
    border_content = [false, false, false, false],
    margin_content = [0, 0, 0, 0]
) {
    return {
        table: {
            widths: ['*'],
            body: [
                [
                    {
                        table: {
                            widths: ['65%', '35%'],
                            body: [
                                [
                                    {
                                        border: [false, false, false, false],
                                        stack: [
                                            {
                                                text: `Cliente            : ${factura.cliente_Razon_Social || "—"}`,
                                                style: 'clientData',
                                            },
                                            {
                                                text: `Ruc                 : ${factura.cliente_Num_Doc || "—"}`,
                                                style: 'clientData',
                                            },
                                            {
                                                text: `Dirección        : ${factura.cliente_Direccion || "—"}`,
                                                style: 'clientData',
                                            },
                                        ]
                                    },
                                    {
                                        border: [false, false, false, false],
                                        stack: [
                                            { text: `Moneda                         : ${factura.tipo_Moneda === 'PEN' ? 'SOLES' : factura.tipo_Moneda}`, style: 'clientData' },
                                            { text: `Condición de Pago        : ${factura.forma_pago_facturas[0]?.tipo?.toUpperCase() == "CREDITO" ? `CREDITO${factura.dias_pagar > 0 && ` A ${factura.dias_pagar} DIAS`}` : "CONTADO"}`, style: 'clientData' },
                                        ],
                                    }
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: function (i, node) { return 0; },
                            vLineWidth: function (i, node) { return 0; },
                            paddingLeft: function (i, node) { return 8; },
                            paddingRight: function (i, node) { return 8; },
                            paddingTop: function (i, node) { return 8; },
                            paddingBottom: function (i, node) { return 8; },
                        },
                        fillColor: bg_color,
                        border: border_content
                    }
                ]
            ]
        },
        layout: {
            hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 1.5 : 0;
            },
            vLineWidth: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 1.5 : 0;
            },
            hLineColor: function (i, node) {
                return innova_blue;
            },
            vLineColor: function (i, node) {
                return innova_blue;
            },
            paddingLeft: function (i, node) { return 0; },
            paddingRight: function (i, node) { return 0; },
            paddingTop: function (i, node) { return 0; },
            paddingBottom: function (i, node) { return 0; },
        },
        margin: margin_content,
    };
}

module.exports = { pdfClienteFactura };
