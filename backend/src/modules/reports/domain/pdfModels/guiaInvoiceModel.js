const path = require("path");
const { pdfheader } = require("../components-facturacion/pdfHeader");
const { pdfClienteGuia } = require("../components-facturacion/pdfClienteGuia");
const logo_innova = path.join(__dirname, "../../../../assets/pdf/logo_innova.png")
const logo = path.join(__dirname, "../../../../assets/pdf/logo.png")


function guiaInvoiceModel(data) {
    const guia = data[0];
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

    const content = [
        // ! seccion de identificadores de la guia y empresa emisora
        pdfheader(
            guia,
            logo_innova,
        ),
        { text: '\n' },
        pdfClienteGuia(
            guia
        )
    ]

    return {
        content: content,
        styles: {
            // ** estilos pdfHeader
            companyName: { fontSize: 8, fontWeight: '800', color: text_innova_gray, },
            companyAddress: { fontSize: 7, margin: [0, 1, 0, 0], color: text_innova_gray, },
            companyContact: { fontSize: 7, margin: [0, 1, 0, 0], color: text_innova_gray, },
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
            // ** estilos pdfHeader final

            // ** estilos pdfClienteGuia
            clientData: { fontSize: 7, margin: [0, 2, 0, 1], color: text_innova_gray },
            // ** estilos pdfClienteGuia final
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
                        text: `Emitido desde ${guia.empresa_link_website}`,
                        style: "footer",
                        alignment: "center",
                        margin: [0, 0, 0, 0]
                    }
                ]
            };
        }
    };

}

module.exports = { guiaInvoiceModel }