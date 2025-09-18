const { utils } = require('../../../../utils/utils')

function pdfDatosGuiaHeader(guia, choferes, transportistas, invi = "#FFFFFF") {
    let transporte = null;

    if (Array.isArray(transportistas) && transportistas.length > 0) {
        transporte = transportistas[0]?.dataValues || transportistas[0];
    }

    return [
        { text: "DATOS DE LA GUÍA", style: "tituloDatosGuia" },
        {
            columns: [
                {
                    width: "40%",
                    table: {
                        widths: ["auto", "auto"],
                        body: [
                            [
                                { text: "MOTIVO DE TRASLADO:", style: "datosGuiaLabel" },
                                {
                                    text:
                                        utils.getMotivoTrasladoDescription(guia.guia_Envio_Cod_Traslado) ||
                                        "—",
                                    style: "datosGuiaValue",
                                    alignment: "left",
                                },
                            ],
                            [
                                { text: "DESCRIPCIÓN:", style: "datosGuiaLabel" },
                                {
                                    text: guia.guia_Envio_Des_Traslado || "—", style: "datosGuiaValue", alignment: "left",
                                },
                            ],
                        ],
                    },
                    layout: "noBorders",
                },
                {
                    width: "60%",
                    table: {
                        widths: ["auto", "auto"],
                        body: [
                            // [
                            //     { text: "UBIGEO DE PARTIDA:", style: "datosGuiaLabel" },
                            //     { text: guia.partidaUbigeo || "—", style: "datosGuiaValue" },
                            // ],
                            [
                                { text: "PUNTO DE PARTIDA:", style: "datosGuiaLabel" },
                                {
                                    text: guia.guia_Envio_Partida_Direccion || "—",
                                    style: "datosGuiaValue",
                                },
                            ],
                            // [
                            //     { text: "UBIGEO DE LLEGADA:", style: "datosGuiaLabel" },
                            //     { text: guia.llegadaUbigeo || "—", style: "datosGuiaValue" },
                            // ],
                            [
                                { text: "PUNTO DE LLEGADA:", style: "datosGuiaLabel" },
                                {
                                    text: guia.guia_Envio_Llegada_Direccion || "—",
                                    style: "datosGuiaValue",
                                },
                            ],
                        ],
                    },
                    layout: "noBorders",
                },
            ],
            columnGap: 10,
            margin: [0, 0, 0, 5],
        },
        //? Transporte
        // ...(transporte
        //     ? [
        //         { text: "DATOS DEL TRANSPORTE", style: "tituloDatosGuia", margin: [0, 0, 0, 5] },
        //         {
        //             columns: [
        //                 {
        //                     width: "100%",
        //                     table: {
        //                         widths: ["15%", "42%", "13%", "10%", "10%", "10%"],
        //                         body: [
        //                             [
        //                                 { text: "RAZÓN SOCIAL:", style: "datosGuiaLabel" },
        //                                 { text: transporte?.razon_Social || "—", style: "datosGuiaValue" },
        //                                 { text: "NRO. DOC:", style: "datosGuiaLabel" },
        //                                 { text: transporte?.nro_doc || "—", style: "datosGuiaValue" },
        //                                 { text: "NRO. MTC:", style: "datosGuiaLabel" },
        //                                 { text: transporte?.nro_mtc || "—", style: "datosGuiaValue" },
        //                             ],
        //                         ],
        //                     },
        //                     layout: "noBorders",
        //                 },
        //             ],
        //         },
        //     ]
        //     : []),
    ]
}

module.exports = { pdfDatosGuiaHeader };


