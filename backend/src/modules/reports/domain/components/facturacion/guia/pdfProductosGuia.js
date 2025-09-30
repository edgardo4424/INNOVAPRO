
function pdfProductosGuia(
    guia,
    bg_color = "#DCDBDB",
    innova_border = "#DCDBDB",
    margin_content = [0, 0, 0, 0]
) {
    const cantidad_total = guia.guia_detalles?.reduce((acc, d) => acc + Number(d.cantidad ?? 0), 0);
    const peso_total = guia.guia_detalles?.reduce((acc, d) => acc + Number(d.peso_kg ?? 0), 0);
    return (
        {
            stack: [
                {
                    table: {
                        widths: ['10%', '65%', '10%', '15%',],
                        body: [
                            [
                                { text: 'ITEM', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                                { text: 'DESCRIPCION', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                                { text: 'UNI.', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                                { text: 'CANTIDAD', style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                            ],
                            ...(guia.guia_detalles?.length ? guia.guia_detalles : []).map(d => [
                                { text: d.cod_Producto || "—", style: 'tableBody', alignment: 'center' },
                                { text: d.descripcion || "—", style: 'tableBody', alignment: 'left' },
                                { text: d.unidad || "—", style: 'tableBody', alignment: 'center' },
                                { text: d.cantidad || "—", style: 'tableBody', alignment: 'center' },
                            ]),
                            [
                                { text: '', style: 'tableBody', alignment: 'center' },
                                { text: '', style: 'tableBody', alignment: 'center' },
                                { text: '', style: 'tableBody', alignment: 'center' },
                                { text: `${cantidad_total}`, style: 'tableHeaderMain', fillColor: bg_color, alignment: 'center' },
                            ],
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
                // { text: `Unidad de Medida del Peso Bruto: ${guia.guia_Envio_Und_Peso_Total || ""}`, style: "datoMedidaPeso" },
                // {
                //     text: `Peso Bruto Total de la carga: ${guia.guia_Envio_Peso_Total || "—"}`,
                //     style: "datoPesoButo",
                // }
            ]
        }
    );
}

module.exports = { pdfProductosGuia };
