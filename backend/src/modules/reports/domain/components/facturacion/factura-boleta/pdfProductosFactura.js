const { utils } = require('../../../../utils/utils')

function pdfProductoFactura(
    factura,
    innova_gray = '#616161',
    bg_color = "#DCDBDB",
    innova_border = "#DCDBDB",
    margin_content = [0, 0, 0, 0]
) {
    return (
        {
            table: {
                widths: ['10%', '5%', '15%', '45%', '8%', '8%', '9%'],
                body: [
                    [
                        { text: 'COD', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'CANT.', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'UNID.', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'DESCRIPCION', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'V. UNIT.', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'IGV.', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'IMPORTE', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' }
                    ],
                    ...(factura.detalle_facturas?.length ? factura.detalle_facturas : []).map(d => [
                        { text: d.cod_Producto || "—", style: 'tableBody', alignment: 'center' },
                        { text: `${Number(d.cantidad ?? 0).toFixed(2)}`, style: 'tableBody', alignment: 'center' },
                        { text: d.unidad || 'NIU', style: 'tableBody', alignment: 'center' },
                        { text: d.descripcion, style: 'tableBody' },
                        { text: utils.formatCurrency(d.monto_Valor_Unitario), style: 'tableBody', alignment: 'center' },
                        { text: utils.formatCurrency(d.total_Impuestos), style: 'tableBody', alignment: 'center' },
                        { text: utils.formatCurrency(d.monto_Precio_Unitario), style: 'tableBody', alignment: 'right' }
                    ])
                ],
            },
            layout: {
                hLineWidth: function (i, node) {
                    return i === 0 || i === node.table.body.length || i === node.table.body.length + 6 ? 1 : 0;
                },
                hLineColor: function (i, node) {
                    return i % 2 === 0 ? innova_border : innova_border;
                },
                vLineColor: function (i, node) {
                    return i % 2 === 0 ? innova_border : innova_border;
                }
            },

        });
}

module.exports = { pdfProductoFactura }