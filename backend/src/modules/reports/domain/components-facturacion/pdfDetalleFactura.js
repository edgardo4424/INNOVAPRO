const { utils } = require('../../utils/utils')

function pdfDetalleFactura(
    factura,
    bg_color = "#DCDBDB",
    bg_content = "#DCDBDB",
    innova_border = "#DCDBDB",
    border_content = [false, false, false, false],
    margin_content = [0, 0, 0, 0],
) {
    return {
        table: {
            widths: ['*'],
            body: [
                [
                    {
                        table: {
                            widths: ['25%', '25%', '25%', '25%'],
                            body: [
                                [
                                    {
                                        text: 'Fecha de Emisión',
                                        style: 'detalles_pre_cliente',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        fillColor: bg_color
                                    },
                                    {
                                        text: 'Forma de Pago',
                                        style: 'detalles_pre_cliente',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        fillColor: bg_color
                                    },
                                    {
                                        text: 'Orden de Compra',
                                        style: 'detalles_pre_cliente',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        fillColor: bg_color
                                    },
                                    {
                                        text: 'Fecha de Vencimiento',
                                        style: 'detalles_pre_cliente',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        fillColor: bg_color
                                    }
                                ],
                                // Fila de valores
                                [
                                    {
                                        text: `${utils.formatDateTime(factura.fecha_Emision)}`,
                                        style: 'detalles_pre_cliente',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                    },
                                    {
                                        text: `${factura.forma_pago_facturas[0]?.tipo?.toUpperCase()}`,
                                        style: 'detalles_pre_cliente',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                    },
                                    {
                                        text: `${factura?.orden_compra || "—"}`,
                                        style: 'detalles_pre_cliente',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                    },
                                    {
                                        text: `${utils.formatDateTime(factura.fecha_vencimiento) || "—"}`,
                                        style: 'detalles_pre_cliente',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                    }
                                ]
                            ]
                        },
                        layout: {
                            // Sin líneas internas
                            hLineWidth: function (i, node) {
                                return (i === 1) ? 0.5 : 0; 
                            },
                            vLineWidth: function (i, node) { return 0; },
                            hLineColor: function (i, node) { return innova_border; },
                            paddingLeft: function (i, node) { return 8; },
                            paddingRight: function (i, node) { return 8; },
                            paddingTop: function (i, node) { return 6; },
                            paddingBottom: function (i, node) { return 6; },
                        },
                        border: border_content
                    }
                ]
            ]
        },
        // Layout para el borde exterior
        layout: {
            hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 1.5 : 0;
            },
            vLineWidth: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 1.5 : 0;
            },
            hLineColor: function (i, node) {
                return innova_border;
            },
            vLineColor: function (i, node) {
                return innova_border;
            },
            paddingLeft: function (i, node) { return 0; },
            paddingRight: function (i, node) { return 0; },
            paddingTop: function (i, node) { return 0; },
            paddingBottom: function (i, node) { return 0; },
        },
        margin: margin_content,
    };
}


module.exports = { pdfDetalleFactura }; 