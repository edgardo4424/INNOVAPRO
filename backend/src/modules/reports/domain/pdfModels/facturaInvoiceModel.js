const path = require("path");
const logo_innova = path.join(__dirname, "../../../../assets/pdf/logo_innova.png")
const logo = path.join(__dirname, "../../../../assets/pdf/logo.png")
const { pdfheader } = require("../components-facturacion/pdfHeader");
const { pdfDetalleFactura } = require("../components-facturacion/pdfDetalleFactura");
const { pdfClienteFactura } = require("../components-facturacion/pdfClienteFactura");
const { pdfProductoFactura } = require("../components-facturacion/pdfProductosFactura");
const { pdfDetallesTotal } = require("../components-facturacion/pdfDetallesTotal");
const { pdfDetalleRelacionados } = require("../components-facturacion/pdfDetalleRelacionados");
const { pdfCuotasFactura } = require("../components-facturacion/pdfCuotasFactura");
const { pdfLegendFactura } = require("../components-facturacion/pdfLegendFactura");

function facturaInvoiceModel(data) {
    const factura = data[0];
    //* Colores base
    const text_innova_gray = '#616161'   //? Texto principal
    const bg_innova_gray = '#DCDBDB'   //? Fondo o relleno
    const innova_white = '#FFFFFF'   //? Fondo neutro / contraste
    const innova_blue = '#1b274a'   //? Primario corporativo (seriedad, confianza)
    const innova_orange = '#d7842d'   //? Primario corporativo (energía, énfasis)

    const innova_blue_light = '#2f3e66'   //? Azul más claro, para fondos secundarios
    const innova_orange_light = '#e8a866'   //? Naranja claro, para resaltar celdas/fondos
    const innova_gray_soft = '#dfe1e5'   //? Gris suave, líneas divisorias o bordes
    const innova_black = '#212121'   //? Texto fuerte o títulos

    // Helper functions for formatting

    const content = [
        // ! seccion de identificadores de la factura y empresa emisora
        pdfheader(
            factura,
            logo_innova,
        ),
        // ! seccion del cliente y pagos
        pdfClienteFactura(
            factura,
        ),
        // { text: '\n' },
        // ! seccion de datos  extras
        pdfDetalleFactura(
            factura,
            bg_innova_gray,
            innova_white,
            bg_innova_gray,
            [true, false, true, true]
        ),
        { text: '\n' },
        // ! seccion de productos
        pdfProductoFactura(
            factura
        ),
        { text: '\n' },
        // ! seccion de totales
        pdfDetallesTotal(
            factura
        ),
        { text: '\n' },
        // ! seccion de leyendas
        pdfLegendFactura(
            factura
        ),
        { text: '\n' },
        // ! seccion de relacionados
        pdfDetalleRelacionados(
            factura
        ),
        { text: '\n' },
        // ! seccion de cuotas
        {
            unbreakable: true,
            stack: [pdfCuotasFactura(factura)]
        },
    ];

    return {
        content: content,
        styles: {
            companyName: { fontSize: 8, fontWeight: '800', color: text_innova_gray, },
            companyAddress: { fontSize: 7, margin: [0, 1, 0, 0], color: text_innova_gray, },
            companyContact: { fontSize: 7, margin: [0, 1, 0, 0], color: text_innova_gray, },
            // ** tipo
            docTypeHeader: {
                fontSize: 8,
                bold: true,
                margin: [0, 4, 0, 0],
                color: text_innova_gray
            },
            docTypeHeaderCenter: {
                fontSize: 10,
                bold: true,
                color: text_innova_gray,
                margin: [0, 0, 0, 0],
                alignment: 'center'
            },
            docNumberHeader: {
                fontSize: 8,
                bold: true,
                color: text_innova_gray
            },
            // ** tipo fin
            sectionHeaderBlue: { fontSize: 11, bold: true, margin: [5, 3, 5, 3] },
            clientData: { fontSize: 7, margin: [0, 2, 0, 1], color: text_innova_gray },
            detalles_pre_cliente: { fontSize: 7, margin: [0, 2, 0, 1], color: text_innova_gray },
            tableHeaderMain: { fontSize: 6, bold: true, color: text_innova_gray, margin: [2, 3, 2, 3] },
            tableBody: { fontSize: 6, color: text_innova_gray, margin: [2, 3, 2, 3] },
            orderInfo: { fontSize: 9, italics: true },
            detractionHeader: { fontSize: 10, bold: true },
            detractionInfo: { fontSize: 9, margin: [0, 1, 0, 1] },
            // ** Totales
            totalfactor: { fontSize: 6, margin: [5, 2, 5, 2], color: text_innova_gray,},
            totalLabel: { fontSize: 6, margin: [5, 2, 5, 2], color: text_innova_gray, fillColor: bg_innova_gray },
            totalValue: { fontSize: 6, margin: [5, 2, 5, 2], color: text_innova_gray },
            totalFinalLabel: { fontSize: 6, bold: true, margin: [5, 3, 5, 3], color: innova_white, fillColor: innova_blue_light },
            totalFinalValue: { fontSize: 6, bold: true, margin: [5, 3, 5, 3], color: text_innova_gray },
            // ** Totales fin
            amountInLetters: { fontSize: 7, bold: true, margin: [0, 5, 0, 5], color: text_innova_gray, border: [true, true, true, true], borderColor: text_innova_gray },
            notes: { fontSize: 9, italics: true },
            legalNote: { fontSize: 8, italics: true, color: '#666666' },
            // ** Pagos
            paymentPlanHeader: { fontSize: 7, bold: true, decoration: 'underline', color: text_innova_gray },
            paymentPlanInfo: { fontSize: 7, margin: [0, 0, 0, 5], color: text_innova_gray },
            paymentTableHeader: { fontSize: 7, bold: true, fillColor: bg_innova_gray, margin: [3, 4, 3, 4], color: text_innova_gray },
            paymentTableBody: { fontSize: 7, margin: [3, 4, 3, 4], color: text_innova_gray },
            // ** Pagos fin
            relatedDocsHeader: { fontSize: 11, bold: true, decoration: 'underline' },
            relatedDocsTableHeader: { fontSize: 9, bold: true, fillColor: bg_innova_gray, margin: [3, 4, 3, 4] },
            relatedDocsBody: { fontSize: 9, margin: [3, 4, 3, 4] },
            footer: { fontSize: 8, color: '#666666' }
        },
        background: function (currentPage, pageSize) {
            return {
                image: logo,
                height: 920,
                width: pageSize.width,
                opacity: 0.1,
                margin: [230, -34, 0, 0],
            };
        },
        defaultStyle: {
            font: "Helvetica",
        },
        pageMargins: [40, 40, 40, 60],
        footer: function (currentPage, pageCount) {
            return {
                columns: [
                    {
                        text: `Página ${currentPage} de ${pageCount}`,
                        style: "footer",
                        alignment: "right",
                        margin: [0, 0, 40, 0]
                    },
                    {
                        text: `Emitido desde ${factura.empresa_link_website}`,
                        style: "footer",
                        alignment: "center",
                        margin: [0, 0, 0, 0]
                    }
                ]
            };
        }
    };
}

module.exports = { facturaInvoiceModel };