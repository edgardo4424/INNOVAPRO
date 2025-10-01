function pdfLegendFactura(
    factura,
    border_color = '#DCDBDB'
) {
    const extraLegend = () => {
        if (String(factura.tipo_Operacion) === "1001") {
            // Detracción
            return {
                text: "OPERACIÓN SUJETA AL SISTEMA DE PAGO DE OBLIGACIONES TRIBUTARIAS CON EL GOBIERNO CENTRAL",
                style: "amountInLetters",
                border: [true, true, true, true],
                borderColor: border_color,
                margin: [0, 2, 0, 0],
            };
        } else if (String(factura.descuento_cod_tipo) === "62") {
            // Retención
            return {
                // text: "",
                text: "OPERACIÓN SUJETA A RETENCIÓN DEL IGV",
                style: "amountInLetters",
                border: [true, true, true, true],
                borderColor: border_color,
                margin: [0, 2, 0, 0],
            };
        }
        return null;
    };

    return {
        stack: [
            {
                text: `${factura.legend_facturas?.[0]?.legend_Value || "—"}`,
                style: "amountInLetters",
                border: [true, true, true, true],
                borderColor: border_color,
            },
            ...(extraLegend() ? [extraLegend()] : []),
        ],
    };
}

module.exports = { pdfLegendFactura };
