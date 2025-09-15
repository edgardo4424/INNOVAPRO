const { utils } = require("../../utils/utils");

function pdfCuotasFactura(factura) {
    // 1. Parsear cuotas_Real si viene como string JSON
    let cuotasReal = [];
    try {
        if (factura.cuotas_Real) {
            cuotasReal = Array.isArray(factura.cuotas_Real)
                ? factura.cuotas_Real
                : JSON.parse(factura.cuotas_Real);
        }
    } catch (e) {
        cuotasReal = [];
    }

    // 2. Decidir qué usar
    const cuotas = cuotasReal.length
        ? cuotasReal
        : (Array.isArray(factura.forma_pago_facturas) ? factura.forma_pago_facturas : []);

    // Cabecera de tabla
    const headerRow = [
        { text: "N° CUOTA", style: "paymentTableHeader", alignment: "center" },
        { text: "FECHA DE VENCIMIENTO", style: "paymentTableHeader", alignment: "center" },
        { text: "MONTO", style: "paymentTableHeader", alignment: "center" }
    ];

    // Filas de cuotas
    const bodyRows = cuotas.length
        ? cuotas.map((pago, idx) => ([
            { text: String(pago.cuota ?? idx + 1), style: "paymentTableBody", alignment: "center" },
            { text: utils.formatDateTime(pago.fecha_Pago), style: "paymentTableBody", alignment: "center" },
            { text: utils.formatCurrency(pago.monto), style: "paymentTableBody", alignment: "right" }
        ]))
        : [[
            { text: "—", colSpan: 3, alignment: "center", style: "paymentTableEmpty" },
            {},
            {}
        ]];

    return {
        stack: [
            {
                columns: [
                    { text: "PLAN DE PAGO", style: "paymentPlanHeader" },
                    { text: `${factura.forma_pago_facturas[0].tipo.toUpperCase() === "CREDITO" ? `TOTAL DE CUOTAS: ${cuotas.length}` : ""}`, style: "paymentPlanInfo", alignment: "right" }
                ],
                margin: [0, 10, 0, 5]
            },
            {
                table: {
                    widths: ["20%", "50%", "30%"],
                    body: [headerRow, ...bodyRows]
                },
                layout: {
                    fillColor: (rowIndex) => (rowIndex === 0 ? "#f2f2f2" : null),
                    hLineColor: () => "#cccccc",
                    vLineColor: () => "#cccccc",
                },
                margin: [0, 5, 0, 15]
            }
        ]
    };
}

module.exports = { pdfCuotasFactura };
