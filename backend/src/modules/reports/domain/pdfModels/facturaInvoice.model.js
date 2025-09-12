function facturaInvoiceModel(data) {
    const factura = data[0];

    // Helper functions for formatting, similar to the React component
    const formatCurrency = (value, code = "PEN") => {
        const n = Number(value ?? 0);
        return `${n.toFixed(2)}`;
    };

    const formatTipoDocCliente = (code) => {
        switch (String(code)) {
            case "6": return "RUC";
            case "1": return "DNI";
            case "4": return "CARNET DE EXTRANJERÍA";
            default: return "OTRO";
        }
    };

    const formatTipoDocLabel = (code) => {
        switch (code) {
            case "01": return "FACTURA ELECTRÓNICA";
            case "03": return "BOLETA DE VENTA ELECTRÓNICA";
            case "07": return "NOTA DE CRÉDITO ELECTRÓNICA";
            case "08": return "NOTA DE DÉBITO ELECTRÓNICA";
            default: return "DOCUMENTO ELECTRÓNICO";
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString("es-PE");
    };

    const numeroDoc = `${factura.serie ?? ""}-${String(factura.correlativo ?? "").padStart(1, "0")}`;

    const content = [
        // Header
        {
            columns: [
                {
                    width: '60%',
                    stack: [
                        { text: factura.empresa_nombre, style: 'companyName' },
                        { text: factura.empresa_ruc, style: 'companyInfo' },
                        { text: factura.empresa_direccion, style: 'companyInfo' },
                    ]
                },
                {
                    width: '40%',
                    alignment: 'right',
                    stack: [
                        { text: formatTipoDocLabel(factura.tipo_doc), style: 'docType' },
                        { text: numeroDoc, style: 'docNumber' },
                        { text: `Fecha de emisión: ${formatDateTime(factura.fecha_Emision)}`, style: 'dateInfo' }
                    ]
                }
            ],
        },

        // Client and Payment Details
        { text: '\n' },
        {
            columns: [
                {
                    width: '50%',
                    stack: [
                        { text: "CLIENTE", style: "sectionHeader" },
                        { text: `Razón social: ${factura.cliente_Razon_Social || "—"}`, style: 'clientInfo' },
                        { text: `Dirección: ${factura.cliente_Direccion || "—"}`, style: 'clientInfo' },
                        { text: `Tipo doc.: ${formatTipoDocCliente(factura.cliente_Tipo_Doc)}`, style: 'clientInfo' },
                        { text: `Número doc.: ${factura.cliente_Num_Doc || "—"}`, style: 'clientInfo' },
                    ]
                },
                {
                    width: '50%',
                    stack: [
                        { text: "DETALLES DEL PAGO", style: "sectionHeader" },
                        { text: `Moneda: ${factura.tipo_Moneda}`, style: 'paymentInfo' },
                        { text: `Total: ${formatCurrency(factura.sub_Total, factura.tipo_Moneda)}`, style: 'paymentInfo' },
                        { text: `Tipo de pago: ${factura.forma_pago_facturas[0]?.tipo?.toUpperCase() || ''} ${factura.dias_pagar !== "" ? `a ${factura.dias_pagar} dias` : ""}`, style: 'paymentInfo' },
                        { text: `Fecha de vencimiento: ${formatDateTime(factura.fecha_vencimiento)}`, style: 'paymentInfo' },
                    ]
                }
            ]
        },

        // Items Table
        { text: "\n" },
        { text: "Productos", style: "sectionHeader" },
        {
            style: "tableItems",
            table: {
                headerRows: 1,
                widths: ["15%", "40%", "15%", "15%", "15%"],
                body: [
                    [{ text: "Código", style: "tableHeader" }, { text: "Producto", style: "tableHeader" }, { text: "P. Unit", style: "tableHeader" }, { text: "Cantidad", style: "tableHeader" }, { text: "Total", style: "tableHeader" }],
                    ...(factura.detalle_facturas?.length ? factura.detalle_facturas : []).map(d => [
                        { text: d.cod_Producto || "—" },
                        { text: d.descripcion },
                        { text: formatCurrency(d.monto_Valor_Unitario, factura.tipo_Moneda), alignment: 'right' },
                        { text: `${Number(d.cantidad ?? 0).toFixed(2)} ${d.unidad}`, alignment: 'right' },
                        { text: formatCurrency(d.monto_Precio_Unitario, factura.tipo_Moneda), alignment: 'right' },
                    ]),
                ],
            },
            layout: "lightHorizontalLines",
        },

        // Legend and Totals
        { text: "\n" },
        {
            columns: [
                {
                    width: '60%',
                    stack: [
                        { text: "Leyenda:", style: "sectionHeader" },
                        { text: factura.legend_facturas?.[0]?.legend_Value ?? "—", style: "legendText" },
                    ]
                },
                {
                    width: '40%',
                    stack: [
                        {
                            table: {
                                widths: ["*", "auto"],
                                body: [
                                    [{ text: "Op. Gravadas:", alignment: 'left', style: 'totalLabel' }, { text: formatCurrency(factura.monto_Oper_Gravadas, factura.tipo_Moneda), alignment: 'right', style: 'totalValue' }],
                                    [{ text: "IGV:", alignment: 'left', style: 'totalLabel' }, { text: formatCurrency(factura.total_Impuestos, factura.tipo_Moneda), alignment: 'right', style: 'totalValue' }],
                                    [{ text: "Precio de venta:", alignment: 'left', style: 'totalFinalLabel' }, { text: formatCurrency(factura.sub_Total, factura.tipo_Moneda), alignment: 'right', style: 'totalFinalValue' }],
                                ]
                            },
                            layout: "noBorders"
                        }
                    ]
                }
            ]
        },

        // Observations and other details (conditional sections)
        ...(factura.observacion ? [
            { text: "\n" },
            { text: "Observaciones:", style: "sectionHeader" },
            { text: factura.observacion, style: "detailsText" }
        ] : []),

        ...(factura.relDocs ? [
            { text: "\n" },
            { text: "Documentos Relacionados:", style: "sectionHeader" },
            {
                ul: JSON.parse(factura.relDocs).map(doc => `Nro. doc: ${doc.nroDoc || "—"}`),
                style: "detailsText"
            }
        ] : []),

        ...(factura.tipo_Operacion == "1001" ? [
            { text: "\n" },
            { text: "DETRACCION", style: "sectionHeader" },
            {
                table: {
                    widths: ["*", "*", "*", "*"],
                    body: [
                        [{ text: "Cta. Cte. Banco", style: 'detailsLabel' }, { text: "Detraccion", style: 'detailsLabel' }, { text: "Bien o Servicio", style: 'detailsLabel' }, { text: "Neto a Pagar", style: 'detailsLabel' }],
                        [
                            { text: factura.detraccion_cta_banco, style: 'detailsValue' },
                            { text: `${factura.detraccion_mount} (${factura.detraccion_percent}%)`, style: 'detailsValue' },
                            { text: "Descripción del bien", style: 'detailsValue' }, // Aquí necesitas la función `getDescripcion`
                            { text: (factura.monto_Imp_Venta - factura.detraccion_mount).toFixed(2), style: 'detailsValue' }
                        ]
                    ]
                },
                layout: 'noBorders'
            }
        ] : []),

        // Payment Table
        { text: "\n" },
        { text: "Plan de Pago", style: "sectionHeader" },
        {
            style: "tablePayments",
            table: {
                headerRows: 1,
                widths: ["25%", "25%", "25%", "25%"],
                body: [
                    [{ text: "Cuota", style: "tableHeader" }, { text: "Tipo", style: "tableHeader" }, { text: "Monto", style: "tableHeader" }, { text: "Fecha", style: "tableHeader" }],
                    ...(factura.forma_pago_facturas?.length ? factura.forma_pago_facturas : []).map(pago => [
                        { text: pago.cuota, alignment: 'center' },
                        { text: pago.tipo, alignment: 'center' },
                        { text: formatCurrency(pago.monto, factura.tipo_Moneda), alignment: 'center' },
                        { text: formatDateTime(pago.fecha_Pago), alignment: 'center' },
                    ]),
                ],
            },
            layout: "lightHorizontalLines",
        },
    ];

    return {
        content: content,
        styles: {
            companyName: { fontSize: 18, bold: true, color: '#1E40AF' },
            companyInfo: { fontSize: 10, margin: [0, 2, 0, 0] },
            docType: { fontSize: 12, bold: true, alignment: 'right' },
            docNumber: { fontSize: 18, bold: true, alignment: 'right' },
            dateInfo: { fontSize: 10, alignment: 'right', italics: true },
            sectionHeader: { fontSize: 11, bold: true, margin: [0, 10, 0, 5], decoration: 'underline' },
            clientInfo: { fontSize: 10, margin: [0, 2, 0, 0] },
            paymentInfo: { fontSize: 10, margin: [0, 2, 0, 0] },
            tableHeader: { bold: true, fillColor: '#E5E7EB', color: '#4B5563', alignment: 'center' },
            tableItems: { margin: [0, 5, 0, 15] },
            legendText: { fontSize: 10, italics: true },
            totalLabel: { bold: true, fontSize: 10, alignment: 'left' },
            totalValue: { fontSize: 10, alignment: 'right' },
            totalFinalLabel: { bold: true, fontSize: 12, alignment: 'left', margin: [0, 5, 0, 0] },
            totalFinalValue: { bold: true, fontSize: 12, alignment: 'right', margin: [0, 5, 0, 0] },
            detailsLabel: { bold: true, fontSize: 10 },
            detailsValue: { fontSize: 10 }
        },
        defaultStyle: {
            font: "Helvetica",
        },
    };
}

module.exports = { facturaInvoiceModel };
