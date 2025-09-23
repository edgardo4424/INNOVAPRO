module.exports = async (body, facturaRepository) => {
    const { id_factura } = body
    // * Llamamos al repositorio para obtener todas las facturas
    const cdrZipObtenido = await facturaRepository.cdrzip(id_factura);

    // ? si no se encuentra la factura
    if (!cdrZipObtenido)
        return {
            codigo: 400,
            respuesta: {
                status: 400,
                succes: false,
                message: "Ocurrio un Error imprevisto",
                data: null,
            },
        };

    const cdrZipBase64 = Buffer.from(cdrZipObtenido.cdr_zip).toString('base64');

    return {
        codigo: 200,
        respuesta: {
            status: 200,
            succes: true,
            mensaje: "Se encontro el cdr-zip correctamente",
            data: {
                cdrZipBase64
            }
        },
    };
};

