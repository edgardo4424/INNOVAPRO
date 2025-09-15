const { utils } = require('../../utils/utils')

function pdfheader(
    doc,
    logo_innova,
    bg_color = "#DCDBDB",
    innova_border = "#DCDBDB",
    border_content = [false, false, false, false],
    margin_content = [0, 0, 0, 10],
) {
    const numeroDoc = `${doc.serie ?? ""}-${String(doc.correlativo ?? "").padStart(8, "0")}`;
    return {
        columns: [
            {
                width: "20%",
                stack: [
                    {
                        image: logo_innova,
                        width: 80,
                        height: 30,
                        margin: [0, 0, 0, 5],
                    },
                ],
            },
            {
                width: "45%",
                stack: [
                    { text: doc.empresa_nombre, style: "companyName" },
                    { text: `${doc.empresa_direccion}`, style: "companyAddress" },
                    {
                        text: `${doc.departamento}-${doc.provincia}-${doc.distrito}`,
                        style: "companyContact",
                    },
                    {
                        text: `telefono: ${doc.empresa_telefono}`,
                        style: "companyContact",
                    },
                    { text: `correo: ${doc.empresa_correo}`, style: "companyContact" },
                    {
                        text: `sitio web: ${doc.empresa_link_website}`,
                        style: "companyContact",
                    },
                ],
            },
            {
                borderWidth: 1,
                borderColor: innova_border,
                width: "35%",
                stack: [
                    {
                        with: "100%",
                        table: {
                            widths: [160],
                            heights: [15, 15, 15],
                            body: [
                                [
                                    {
                                        text: `RUC: ${doc.empresa_ruc || doc.empresa_Ruc}`,
                                        style: "docTypeHeader",
                                        alignment: "center",
                                        border: [false, false, false, false],
                                    },
                                ],
                                [
                                    {
                                        text: utils.formatTipoDocLabel(doc.tipo_Doc),
                                        style: "docTypeHeaderCenter",
                                        alignment: "center",
                                        border: [false, false, false, false],
                                    },
                                ],
                                [
                                    {
                                        text: numeroDoc,
                                        style: "docNumberHeader",
                                        alignment: "center",
                                        border: [false, false, false, false],
                                    },
                                ],
                            ],
                        },
                        absolutePosition: { x: 387, y: 25 },
                    },
                ],
            },
        ],
        layout: {
            hLineWidth: function (i, node) {
                return 0;
            },
            vLineWidth: function (i, node) {
                return 0;
            },
            paddingLeft: function (i, node) {
                return 8;
            },
            paddingRight: function (i, node) {
                return 8;
            },
            paddingTop: function (i, node) {
                return 8;
            },
            paddingBottom: function (i, node) {
                return 0;
            },
        },
        fillColor: bg_color,
        border: border_content,
        margin: margin_content,
    };
};

module.exports = { pdfheader };

