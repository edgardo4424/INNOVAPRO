const { utils } = require('../../../../utils/utils')

function pdfProductoNota(
    nota,
    innova_gray = '#616161',
    bg_color = "#DCDBDB",
    innova_border = "#DCDBDB",
    margin_content = [0, 0, 0, 0]
) {
    // Determinar la fuente de datos, priorizando 'detalle_nota_cre_debs' si existe
    const detalles = nota.detalle_nota_cre_debs?.length > 0 ? nota.detalle_nota_cre_debs : nota.detalle_facturas;

    return (
        {
            table: {
                widths: ['10%', '5%', '15%', '41%', '12%', '8%', '9%'],
                body: [
                    [
                        { text: 'COD', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'CANT.', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'UNID.', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'DESCRIPCION', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'MONT. BASE', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'DSCTO.', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                        { text: 'IMPORTE', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' }
                    ],
                    ...(detalles?.length ? detalles : []).map(d => [
                        { text: d.cod_Producto || "—", style: 'tableBody', alignment: 'center' },
                        { text: `${Number(d.cantidad ?? 0).toFixed(2)}`, style: 'tableBody', alignment: 'center' },
                        { text: utils.getUnidadDeMedida(d.unidad) || 'NIU', style: 'tableBody', alignment: 'center' },
                        { text: d.descripcion, style: 'tableBody' },
                        { text: d.Descuentos ? JSON.parse(d.Descuentos)[0].montoBase.toFixed(2) : `${d.monto_Valor_Unitario ? d.monto_Valor_Unitario : "-"}`, style: 'tableBody', alignment: 'center' },
                        { text: d.Descuentos ? JSON.parse(d.Descuentos)[0].Monto.toFixed(2) : "-", style: 'tableBody', alignment: 'center' },
                        { text: utils.formatMoney(d.monto_Valor_Venta), style: 'tableBody', alignment: 'right' }
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

module.exports = { pdfProductoNota }