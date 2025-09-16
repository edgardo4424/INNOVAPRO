
function pdfProductosGuia(
    guia,
    bg_color = "#DCDBDB",
    innova_border = "#DCDBDB",
    margin_content = [0, 0, 0, 0]
) {
    return (
        {
            stack: [
                {
                    table: {
                        widths: ['20%', '40%', '20%', '20%'],
                        body: [
                            [
                                { text: 'CODIGO', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                                { text: 'DESCRIPCION', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                                { text: 'CANTIDAD.', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                                { text: 'UNIDAD', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                            ],
                            ...(guia.guia_detalles?.length ? guia.guia_detalles : []).map(d => [
                                { text: d.cod_Producto || "—", style: 'tableBody', alignment: 'center' },
                                { text: d.descripcion || "—", style: 'tableBody', alignment: 'left' },
                                { text: d.cantidad || "—", style: 'tableBody', alignment: 'center' },
                                { text: d.unidad || "—", style: 'tableBody', alignment: 'center' },

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

                },
                { text: `Unidad de Medida del Peso Bruto: ${guia.guia_Envio_Und_Peso_Total || ""}`, style: "datoMedidaPeso" },
                {
                    text: `Peso Bruto Total de la carga: ${guia.guia_Envio_Peso_Total || "—"}`,
                    style: "datoPesoButo",
                }
            ]
        }
    );
}

module.exports = { pdfProductosGuia };
