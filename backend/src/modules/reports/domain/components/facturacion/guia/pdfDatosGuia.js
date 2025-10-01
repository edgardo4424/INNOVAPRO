const { utils } = require('../../../../utils/utils')

function pdfDatosGuia(guia, choferes, transportistas, invi = "#FFFFFF") {
    let transporte = null;

    if (Array.isArray(transportistas) && transportistas.length > 0) {
        transporte = transportistas[0]?.dataValues || transportistas[0];
    }

    //? Crear secciones de choferes
    const choferesContent =
        choferes.length > 0
            ? choferes.map((chofer) => {
                const choferData = chofer.dataValues || chofer.get?.() || chofer;
                const nombreCompleto = `${choferData.nombres || ""} ${choferData.apellidos || ""
                    }`.trim();

                return {
                    width: "100%",
                    columns: [
                        {
                            width: "100%",
                            table: {
                                widths: ["4.5%", "8.5%", "7.5%", "10.5%", "7.5%", "10.5%", "16.5%", "34.5%"],
                                body: [
                                    [
                                        { text: "TIPO:", style: "datosGuiaChoferLabel" },
                                        { text: choferData.tipo || "—", style: "datosGuiaChoferValue" },
                                        { text: "LICENCIA:", style: "datosGuiaChoferLabel" },
                                        { text: choferData.licencia || "—", style: "datosGuiaChoferValue" },
                                        { text: "NRO DOC:", style: "datosGuiaChoferLabel" },
                                        { text: choferData.nro_doc || "—", style: "datosGuiaChoferValue" },
                                        { text: "NOMBRE COMPLETO:", style: "datosGuiaChoferLabel" },
                                        { text: nombreCompleto || "—", style: "datosGuiaChoferValue" },
                                    ],
                                ],
                            },
                            layout: "noBorders",
                        },
                            // {
                            //     width: "60%",
                            //     table: {
                            //         widths: ["40%", "60%"],
                            //         body: [
                            //             [
                            //                 { text: "NRO DOC:", style: "datosGuiaChoferLabel" },
                            //                 { text: choferData.nro_doc || "—", style: "datosGuiaChoferValue" },
                            //             ],
                            //             [
                            //                 { text: "NOMBRE COMPLETO:", style: "datosGuiaChoferLabel" },
                            //                 { text: nombreCompleto || "—", style: "datosGuiaChoferValue" },
                            //             ],
                            //         ],
                            //     },
                            //     layout: "noBorders",
                            // },
                    ],
                    margin: [0, 0, 0, 5],
                };
            })
            : [
                {
                    width: "100%",
                    table: {
                        widths: ["100%"],
                        body: [
                            [
                                {
                                    text: "NO HAY CHOFERES REGISTRADOS",
                                    style: "datosGuiaLabel",
                                    alignment: "center",
                                },
                            ],
                        ],
                    },
                    layout: "noBorders",
                },
            ];

    return [
        { text: "DATOS DEL TRASLADO", style: "tituloDatosGuia" },
        {
            columns: [
                {
                    width: "100%",
                    table: {
                        widths: ["25%", "15%", "15%", "15%", "10%", "10%"],
                        body: [
                            [
                                { text: "MODALIDAD DE TRASLADO:", style: "datosGuiaLabel" },
                                {
                                    text:
                                        utils.getModalidadTrasladoDescription(guia.guia_Envio_Mod_Traslado) ||
                                        "—",
                                    style: "datosGuiaValue",
                                },

                                { text: "PESO TOTAL:", style: "datosGuiaLabel" },
                                {
                                    text: `${guia.guia_Envio_Peso_Total || "—"} ${guia.guia_Envio_Und_Peso_Total || ""
                                        }`,
                                    style: "datosGuiaValue",
                                },
                                { text: "VEHÍCULO:", style: "datosGuiaLabel" },
                                { text: guia.guia_Envio_Vehiculo_Placa || "—", style: "datosGuiaValue" },
                            ],
                        ],
                    },
                    layout: "noBorders",
                },
                // {
                //     width: "50%",
                //     table: {
                //         widths: ["40%", "60%"],
                //         body: [
                //             [
                //                 { text: "VEHÍCULO:", style: "datosGuiaLabel" },
                //                 { text: guia.guia_Envio_Vehiculo_Placa || "—", style: "datosGuiaValue" },
                //             ],
                // [
                //     { text: "UBIGEO DE PARTIDA:", style: "datosGuiaLabel" },
                //     { text: guia.partidaUbigeo || "—", style: "datosGuiaValue" },
                // ],
                // [
                //     { text: "PUNTO DE PARTIDA:", style: "datosGuiaLabel" },
                //     {
                //         text: guia.guia_Envio_Partida_Direccion || "—",
                //         style: "datosGuiaValue",
                //     },
                // ],
                // [
                //     { text: "UBIGEO DE LLEGADA:", style: "datosGuiaLabel" },
                //     { text: guia.llegadaUbigeo || "—", style: "datosGuiaValue" },
                // ],
                // [
                //     { text: "PUNTO DE LLEGADA:", style: "datosGuiaLabel" },
                //     {
                //         text: guia.guia_Envio_Llegada_Direccion || "—",
                //         style: "datosGuiaValue",
                //     },
                // ],
                //         ],
                //     },
                //     layout: "noBorders",
                // },
            ],
            columnGap: 10,
            margin: [0, 0, 0, 10],
        },
        //? Transporte
        ...(transporte
            ? [
                { text: "DATOS DEL TRANSPORTE", style: "tituloDatosGuia", margin: [0, 0, 0, 5] },
                {
                    columns: [
                        {
                            width: "100%",
                            table: {
                                widths: ["15%", "42%", "13%", "10%", "10%", "10%"],
                                body: [
                                    [
                                        { text: "RAZÓN SOCIAL:", style: "datosGuiaLabel" },
                                        { text: transporte?.razon_Social || "—", style: "datosGuiaValue" },
                                        { text: "NRO. DOC:", style: "datosGuiaLabel" },
                                        { text: transporte?.nro_doc || "—", style: "datosGuiaValue" },
                                        { text: "NRO. MTC:", style: "datosGuiaLabel" },
                                        { text: transporte?.nro_mtc || "—", style: "datosGuiaValue" },
                                    ],
                                ],
                            },
                            layout: "noBorders",
                        },
                    ],
                    margin: [0, 0, 0, 10],
                },
            ]
            : []),
        //? Choferes
        choferes.length > 0 ? { text: "CHOFER", style: "tituloDatosGuia", margin: [0, 0, 0, 5] } : null,
        choferes.length > 0 ? { stack: choferesContent } : null,
    ].filter((item) => item !== null);
}

module.exports = { pdfDatosGuia };
