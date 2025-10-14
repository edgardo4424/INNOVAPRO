function pdfLegendNota(
    nota,
    border_color = '#DCDBDB'
) {
    return {
        table: {
            widths: ['*'],
            body: [
                [
                    {
                        text: `${nota.legend_nota_cre_debs?.[0]?.legend_Value || "—"}`,
                        style: "amountInLetters",
                        // Definimos los bordes a nivel de celda
                        border: [true, true, true, true]
                    }
                ]
            ]
        },
        // Definimos el color del borde y el estilo en el layout de la tabla
        layout: {
            hLineWidth: function(i, node) { return 1; }, // Ancho de línea horizontal
            vLineWidth: function(i, node) { return 1; }, // Ancho de línea vertical
            hLineColor: function(i, node) { return border_color; }, // Color de línea horizontal
            vLineColor: function(i, node) { return border_color; }, // Color de línea vertical
            paddingTop: function(i, node) { return 5; },
            paddingBottom: function(i, node) { return 5; }
        }
    };
}

module.exports = { pdfLegendNota };