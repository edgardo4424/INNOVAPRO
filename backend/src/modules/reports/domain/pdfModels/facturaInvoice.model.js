const path = require("path");
const logo_innova = path.join(__dirname, "../../../../assets/pdf/logo_innova.png")

function facturaInvoiceModel(data) {
    const factura = data[0];
    const innova_gray = '#4A4A4A'
    const innova_blue = '#1b274a'
    const innova_orange = '#d7842d'

    // Helper functions for formatting
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

    const numeroDoc = `${factura.serie ?? ""}-${String(factura.correlativo ?? "").padStart(8, "0")}`;

    const content = [
        // ! seccion de identificadores de la factura y empresa emisora
        {
            columns: [
                {
                    width: '20%',
                    stack: [
                        {
                            image: logo_innova,
                            width: 80,
                            height: 30,
                            margin: [0, 0, 0, 5],
                        },
                    ]
                },
                {
                    width: '45%',
                    stack: [
                        { text: factura.empresa_nombre, style: 'companyName' },
                        { text: `${factura.empresa_direccion}`, style: 'companyAddress' },
                        { text: `${factura.departamento}-${factura.provincia}-${factura.distrito}`, style: 'companyContact' },
                        { text: `telefono: ${factura.empresa_telefono}`, style: 'companyContact' },
                        { text: `correo: ${factura.empresa_correo}`, style: 'companyContact' },
                        { text: `sitio web: ${factura.empresa_link_website}`, style: 'companyContact' },
                    ]
                },
                {
                    width: '35%',
                    stack: [
                        {
                            canvas: [
                                {
                                    type: 'rect',
                                    x: 10,
                                    y: -15,
                                    w: 170,
                                    h: 60,
                                    r: 5,
                                    lineColor: innova_gray,
                                },
                            ]
                        },
                        {
                            with: '100%',
                            table: {
                                widths: [190],
                                heights: [15, 15, 15],
                                body: [
                                    [{ text: `RUC: ${factura.empresa_ruc}`, style: 'docTypeHeader', alignment: 'center', fillColor: '#FFFFFF', border: [false, false, false, false] },],
                                    [{ text: formatTipoDocLabel(factura.tipo_Doc), style: 'docTypeHeaderCenter', alignment: 'center', fillColor: '#FFFFFF', border: [false, false, false, false] }],
                                    [{ text: numeroDoc, style: 'docNumberHeader', alignment: 'center', fillColor: '#FFFFFF', border: [false, false, false, false] }]
                                ]
                            },
                            absolutePosition: { x: 367, y: 25 }
                        }
                    ]
                }
            ],
            margin: [0, 0, 0, 20]
        },
        // ! seccion del cliente y pagos
        {
            canvas: [
                {
                    type: 'rect',
                    x: 0,
                    y: 2,
                    w: 515,
                    h: 50,
                    r: 5,
                    lineColor: innova_gray,
                },
            ],
            absolutePosition: { x: 40, y: 90 }
        },
        {
            columns: [
                {
                    width: '2%',
                    stack: [

                    ]
                },
                {
                    width: '60%',
                    stack: [

                        {
                            text: `Cliente            : ${factura.cliente_Razon_Social || "—"}`,
                            style: 'clientData',
                            maxLines: 2,
                            lineBreak: 'auto',
                            wordBreak: 'normal',
                            overflow: 'break',
                            width: '100%'
                        },
                        {
                            text: `Ruc                 : ${factura.cliente_Num_Doc || "—"}`,
                            style: 'clientData',
                            maxLines: 2,
                            lineBreak: 'auto',
                            wordBreak: 'normal',
                            overflow: 'break',
                            width: '100%'
                        },
                        {
                            text: `Dirección        : ${factura.cliente_Direccion || "—"}`,
                            style: 'clientData',
                            maxLines: 2,
                            lineBreak: 'auto',
                            wordBreak: 'normal',
                            overflow: 'break',
                            width: '100%'
                        },
                    ],
                },
                {
                    width: '35%',
                    stack: [
                        { text: `Moneda                         : ${factura.tipo_Moneda === 'PEN' ? 'SOLES' : factura.tipo_Moneda}`, style: 'clientData' },
                        { text: `Condición de Pago        : ${factura.forma_pago_facturas[0]?.tipo?.toUpperCase() == "CREDITO" ? `CREDITO${factura.dias_pagar > 0 && ` A ${factura.dias_pagar} DIAS`}` : "CONTADO"}`, style: 'clientData' },
                    ],
                }
            ],
            margin: [0, 0, 0, 15],
        },

        // ! seccion de datos  extra
        {
            canvas: [
                {
                    type: 'rect',
                    x: 0,
                    y: -10,
                    w: 515,
                    h: 25,
                    r: 5,
                    lineColor: innova_gray,
                },
            ],
            absolutePosition: { x: 40, y: 155 }
        },
        {

            // factura.forma_pago_facturas[0]?.tipo?.toUpperCase()
            columns: [
                {
                    width: '25%',
                    stack: [
                        { text: `Fecha de Emisión`, style: 'detalles_pre_cliente', alignment: 'center', border: [false, false, true, false] },
                        { text: `${formatDateTime(factura.fecha_Emision)}`, style: 'detalles_pre_cliente', alignment: 'center', border: [false, false, true, false] },
                    ]
                },
                {
                    width: '25%',
                    stack: [
                        { text: `Forma de Pago`, style: 'detalles_pre_cliente', alignment: 'center', border: [false, false, true, false] },
                        { text: `${factura.forma_pago_facturas[0]?.tipo?.toUpperCase()}`, style: 'detalles_pre_cliente', alignment: 'center', border: [false, false, true, false] },
                    ]
                },
                {
                    width: '25%',
                    stack: [
                        { text: `Orden de Compra`, style: 'detalles_pre_cliente', alignment: 'center', border: [false, false, true, false] },
                        { text: `${factura.Orden_compra}`, style: 'detalles_pre_cliente', alignment: 'center', border: [false, false, true, false] },
                    ]
                },
                {
                    width: '25%',
                    stack: [
                        { text: `Fecha de Vencimiento`, style: 'detalles_pre_cliente', alignment: 'center', border: [false, false, true, false] },
                        { text: `${formatDateTime(factura.fecha_vencimiento)}`, style: 'detalles_pre_cliente', alignment: 'center', border: [false, false, true, false] },
                    ]
                },
            ],
            margin: [0, 0, 0, 25],
        },
        // Items Table Header
        {
            table: {
                widths: ['10%', '5%', '15%', '45%', '8%', '8%', '9%'],
                body: [
                    [
                        { text: 'COD', style: 'tableHeaderMain', alignment: 'center' },
                        { text: 'CANT.', style: 'tableHeaderMain', alignment: 'center' },
                        { text: 'UNID.', style: 'tableHeaderMain', alignment: 'center' },
                        { text: 'DESCRIPCION', style: 'tableHeaderMain', alignment: 'center' },
                        { text: 'V. UNIT.', style: 'tableHeaderMain', alignment: 'center' },
                        { text: 'P. UNIT.', style: 'tableHeaderMain', alignment: 'center' },
                        { text: 'IMPORTE', style: 'tableHeaderMain', alignment: 'center' }
                    ]
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    return i % 2 === 0 ? 1 : 0;
                },
                vLineWidth: function (i, node) {
                    return i % 2 === 0 ? 1 : 0;
                },
                hLineColor: function (i, node) {
                    return i % 2 === 0 ? "#E8E8E8" : "#4A4A4A";
                },
                vLineColor: function (i, node) {
                    return i % 2 === 0 ? "#E8E8E8" : "#4A4A4A";
                }
            }
        },

        // Items Table Body
        {
            table: {
                widths: ['10%', '5%', '15%', '45%', '8%', '8%', '9%'],
                body: [
                    ...(factura.detalle_facturas?.length ? factura.detalle_facturas : []).map(d => [
                        { text: d.cod_Producto || "—", style: 'tableBody', alignment: 'center' },
                        { text: `${Number(d.cantidad ?? 0).toFixed(2)}`, style: 'tableBody', alignment: 'center' },
                        { text: d.unidad || 'NIU', style: 'tableBody', alignment: 'center' },
                        { text: d.descripcion, style: 'tableBody' },
                        { text: formatCurrency(d.monto_Valor_Unitario), style: 'tableBody', alignment: 'center' },
                        { text: formatCurrency(d.monto_Precio_Unitario), style: 'tableBody', alignment: 'center' },
                        { text: formatCurrency(d.monto_Valor_Venta), style: 'tableBody', alignment: 'right' }
                    ])
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    return i === 0 || i === node.table.body.length || i === node.table.body.length + 6 ? 1 : 0;
                },
                hLineColor: function (i, node) {
                    return i % 2 === 0 ? "#E8E8E8" : "#E8E8E8";
                },
                vLineColor: function (i, node) {
                    return i % 2 === 0 ? "#E8E8E8" : "#E8E8E8";
                }
            }
        },

        // Detraction section (if applicable)
        ...(factura.tipo_Operacion === "1001" && factura.detraccion_mount ? [
            { text: '\nOPERACIÓN SUJETA A DETRACCIÓN', style: 'detractionHeader', alignment: 'center', margin: [0, 10, 0, 5] },
            { text: `CUENTA: BANCO DE LA NACION CTA. Nº ${factura.detraccion_cta_banco || ''}`, style: 'detractionInfo' },
            { text: `TIPO DE DETRACCIÓN: [027] SERVICIO DE TRANSPORTE DE BIENES POR VÍA TERRESTRE`, style: 'detractionInfo' },
            { text: `MEDIO DE PAGO: [001] DEPÓSITO EN CUENTA`, style: 'detractionInfo' },
            { text: `DETRACCIÓN ${factura.detraccion_percent || 4} %: ${formatCurrency(factura.detraccion_mount)}`, style: 'detractionInfo', margin: [0, 0, 0, 10] }
        ] : []),

        // Totals section
        { text: '\n' },
        {
            columns: [
                {
                    width: '60%',
                    text: ''
                },
                {
                    width: '40%',
                    table: {
                        widths: ['60%', '40%'],
                        body: [
                            [{ text: 'GRAVADA (S/)', style: 'totalLabel' }, { text: formatCurrency(factura.monto_Oper_Gravadas), style: 'totalValue', alignment: 'right' }],
                            [{ text: 'OP. INAFECTA (S/)', style: 'totalLabel' }, { text: '0.00', style: 'totalValue', alignment: 'right' }],
                            [{ text: 'OP. EXONERADA (S/)', style: 'totalLabel' }, { text: '0.00', style: 'totalValue', alignment: 'right' }],
                            [{ text: 'IGV 18.00% (S/)', style: 'totalLabel' }, { text: formatCurrency(factura.total_Impuestos), style: 'totalValue', alignment: 'right' }],
                            [{ text: 'TOTAL (S/)', style: 'totalFinalLabel' }, { text: formatCurrency(factura.sub_Total), style: 'totalFinalValue', alignment: 'right' }]
                        ]
                    },
                    layout: 'lightHorizontalLines'
                }
            ]
        },

        // Amount in letters
        { text: '\n' },
        { text: `IMPORTE EN LETRAS: ${factura.legend_facturas?.[0]?.legend_Value || "—"}`, style: 'amountInLetters' },

        // Additional info
        ...(factura.observacion ? [
            { text: '\n' },
            { text: `NOTAS: ${factura.observacion}`, style: 'notes' }
        ] : []),

        { text: '\nREPRESENTACIÓN IMPRESA DE LA FACTURA ELECTRÓNICA', style: 'legalNote', alignment: 'center', margin: [0, 15, 0, 10] },

        // Payment Plan
        { text: 'PLAN DE PAGO', style: 'paymentPlanHeader', margin: [0, 10, 0, 5] },
        { text: `TOTAL DE CUOTAS: ${factura.forma_pago_facturas?.length || 0}`, style: 'paymentPlanInfo' },
        {
            table: {
                widths: ['33%', '33%', '34%'],
                body: [
                    [
                        { text: 'N° CUOTA', style: 'paymentTableHeader', alignment: 'center' },
                        { text: 'FECHA DE VENCIMIENTO', style: 'paymentTableHeader', alignment: 'center' },
                        { text: 'MONTO', style: 'paymentTableHeader', alignment: 'center' }
                    ],
                    ...(factura.forma_pago_facturas?.length ? factura.forma_pago_facturas : []).map(pago => [
                        { text: pago.cuota, style: 'paymentTableBody', alignment: 'center' },
                        { text: formatDateTime(pago.fecha_Pago), style: 'paymentTableBody', alignment: 'center' },
                        { text: formatCurrency(pago.monto), style: 'paymentTableBody', alignment: 'center' }
                    ])
                ]
            },
            layout: 'lightHorizontalLines',
            margin: [0, 5, 0, 15]
        },

        // Related Documents
        ...(factura.relDocs ? [
            { text: 'Documentos Relacionados', style: 'relatedDocsHeader', margin: [0, 10, 0, 5] },
            {
                table: {
                    widths: ['50%', '50%'],
                    body: [
                        [
                            { text: 'Documento', style: 'relatedDocsTableHeader', alignment: 'center' },
                            { text: 'Identificador', style: 'relatedDocsTableHeader', alignment: 'center' }
                        ],
                        ...JSON.parse(factura.relDocs).map(doc => [
                            { text: `Guía de Remisión ${doc.tipoDoc === '09' ? 'Remitente' : 'Transportista'}`, style: 'relatedDocsBody' },
                            { text: doc.nroDoc || "—", style: 'relatedDocsBody' }
                        ])
                    ]
                },
                layout: 'lightHorizontalLines'
            }
        ] : []),

        // Footer
        { text: '\nPágina 1 de 1', style: 'footer', alignment: 'right', margin: [0, 20, 0, 0] },
        { text: 'Emitido desde https://grupoinnova.pe', style: 'footer', alignment: 'center', margin: [0, 5, 0, 0] }
    ];

    return {
        content: content,
        styles: {
            companyName: { fontSize: 8, fontWeight: '800', color: innova_gray, },
            companyAddress: { fontSize: 7, margin: [0, 1, 0, 0], color: innova_gray, },
            companyContact: { fontSize: 7, margin: [0, 1, 0, 0], color: innova_gray, },
            // ** tipo
            docTypeHeader: {
                fontSize: 8,
                bold: true,
                color: innova_gray,
                margin: [0, 4, 0, 0]
            },
            docTypeHeaderCenter: {
                fontSize: 10,
                bold: true,
                color: innova_gray,
                margin: [0, 0, 0, 0],
                alignment: 'center'
            },
            docNumberHeader: {
                fontSize: 8,
                bold: true,
                color: innova_gray
            },
            // ** tipo fin
            sectionHeaderBlue: { fontSize: 11, bold: true, margin: [5, 3, 5, 3] },
            clientData: { fontSize: 7, margin: [0, 2, 0, 1], color: innova_gray },
            detalles_pre_cliente: { fontSize: 7, margin: [0, 2, 0, 1], color: innova_gray },
            tableHeaderMain: { fontSize: 6, bold: true, color: innova_gray, fillColor: '#E8E8E8', margin: [2, 3, 2, 3] },
            tableBody: { fontSize: 6, color: innova_gray, margin: [2, 3, 2, 3] },
            orderInfo: { fontSize: 9, italics: true },
            detractionHeader: { fontSize: 10, bold: true },
            detractionInfo: { fontSize: 9, margin: [0, 1, 0, 1] },
            totalLabel: { fontSize: 9, bold: true, margin: [5, 2, 5, 2] },
            totalValue: { fontSize: 9, margin: [5, 2, 5, 2] },
            totalFinalLabel: { fontSize: 10, bold: true, margin: [5, 3, 5, 3], fillColor: '#E8E8E8' },
            totalFinalValue: { fontSize: 10, bold: true, margin: [5, 3, 5, 3], fillColor: '#E8E8E8' },
            amountInLetters: { fontSize: 9, bold: true, margin: [0, 5, 0, 5] },
            notes: { fontSize: 9, italics: true },
            legalNote: { fontSize: 8, italics: true, color: '#666666' },
            paymentPlanHeader: { fontSize: 11, bold: true, decoration: 'underline' },
            paymentPlanInfo: { fontSize: 9, margin: [0, 0, 0, 5] },
            paymentTableHeader: { fontSize: 9, bold: true, fillColor: '#E8E8E8', margin: [3, 4, 3, 4] },
            paymentTableBody: { fontSize: 9, margin: [3, 4, 3, 4] },
            relatedDocsHeader: { fontSize: 11, bold: true, decoration: 'underline' },
            relatedDocsTableHeader: { fontSize: 9, bold: true, fillColor: '#E8E8E8', margin: [3, 4, 3, 4] },
            relatedDocsBody: { fontSize: 9, margin: [3, 4, 3, 4] },
            footer: { fontSize: 8, color: '#666666' }
        },
        defaultStyle: {
            font: "Helvetica",
        },
        pageMargins: [40, 40, 40, 40],
    };
}

module.exports = { facturaInvoiceModel };