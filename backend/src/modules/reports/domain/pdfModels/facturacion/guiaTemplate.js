const path = require("path");
const logo_innova = path.join(__dirname, "../../../../../assets/pdf/logo_innova.png")
const logo = path.join(__dirname, "../../../../../assets/pdf/logo.png")
const { pdfheader } = require("../../components/facturacion/pdfHeader");
const { pdfClienteGuia } = require("../../components/facturacion/guia/pdfClienteGuia");
const { pdfDatosGuiaHeader } = require("../../components/facturacion/guia/pdfDatosGuiaHeader");
const { pdfProductosGuia } = require("../../components/facturacion/guia/pdfProductosGuia");
const { pdfDatosGuia } = require("../../components/facturacion/guia/pdfDatosGuia");
const { pdfObservacionesGuia } = require("../../components/facturacion/guia/pdfObservacionesGuia");

function guiaTemplate(data) {
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
    const innova_black = '#AAAAAA'   //? Texto fuerte o títulos

    const choferes = guia.guia_choferes.filter(item => item.nro_mtc === null);
    const transportistas = guia.guia_choferes.filter(item => item.nro_mtc !== null);

    const content = [
        // ! seccion de identificadores de la guia y empresa emisora
        pdfheader(
            guia,
            logo_innova,
        ),
        // { text: '\n' },
        // ! seccion del cliente y fechas
        pdfClienteGuia(
            guia,
        ),
        { text: '\n' },
        // ! seccion de la guia, direcciones, motivo, modalidades, choferes, etc
        pdfDatosGuiaHeader(
            guia,
            choferes,
            transportistas
        ),
        // { text: '\n' },
        // ! seccion de productos
        pdfProductosGuia(
            guia,
            undefined,
            innova_black,
        ),
        { text: '\n' },
        {
            unbreakable: true,
            stack: [pdfDatosGuia(
                guia,
                choferes,
                transportistas
            )]
        },
        { text: '\n' },
        // ! seccion de observaciones
        {
            unbreakable: true,
            stack: [pdfObservacionesGuia(guia)]
        },
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
            clientDataHeader: { fontSize: 7, margin: [0, 2, 0, 1], color: text_innova_gray, bold: true },
            // clientDataInvi: { fontSize: 7, margin: [0, 2, 0, 1], color: innova_white },
            // ** estilos pdfClienteGuia final

            // ** estilo pdfDatosGuia
            tituloDatosGuia: { fontSize: 7, margin: [0, 2, 0, 2], bold: true, color: text_innova_gray },
            datosGuiaInfoHeader: { fontSize: 7, margin: [0, 0, 0, 3], color: text_innova_gray, bold: true },
            datosGuiaLabel: { fontSize: 6, margin: [0, 3, 0, 0], bold: true, color: text_innova_gray },
            datosGuiaValue: { fontSize: 6, margin: [0, 3, 0, 0], color: text_innova_gray },
            datosGuiaChoferLabel: { fontSize: 6, margin: [0, 2, 0, 0], bold: true, color: text_innova_gray },
            datosGuiaChoferValue: { fontSize: 6, margin: [0, 2, 0, 0], color: text_innova_gray },
            // ** estilo pdfDatosGuia final

            // ** estilo pdfProductosGuia
            tableHeaderMain: { fontSize: 6, bold: true, color: text_innova_gray, margin: [2, 3, 2, 3] },
            tableBody: { fontSize: 6, color: text_innova_gray, margin: [2, 0, 2, 0.5] },
            datoMedidaPeso: { fontSize: 8, margin: [3, 6, 0, 0], bold: true, color: text_innova_gray },
            datoPesoButo: { fontSize: 8, margin: [3, 6, 0, 0], color: text_innova_gray },
            // ** estilo pdfProductosGuia final

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
        pageMargins: [40, 40, 40, 40],
        footer: function (currentPage, pageCount) {
            return {
                columns: [
                    {
                        text: `Emitido desde ${guia.empresa_link_website}`,
                        style: "footer",
                        alignment: "center",
                        margin: [0, 5, 0, 0]
                    },
                    {
                        text: `Página ${currentPage} de ${pageCount}`,
                        style: "footer",
                        alignment: "right",
                        margin: [0, 5, 40, 0]
                    }
                ]
            };
        }
    };

}

module.exports = { guiaTemplate }