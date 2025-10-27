
 function mapearDataEscuadrasConPlataformas({ pdfCotizacionDataSnapshot, respuesta }) {

    console.log("pdfCotizacionDataSnapshot", pdfCotizacionDataSnapshot);

  const tienePernoExpansionConArgolla = pdfCotizacionDataSnapshot?.perno_expansion_con_argolla?.total > 0 ? true : false;
const tienePernoExpansionSinArgolla = pdfCotizacionDataSnapshot?.perno_expansion_sin_argolla?.total > 0 ? true : false;
    const tieneDetallesEscaleras = Object.keys(pdfCotizacionDataSnapshot?.detalles_escaleras || {}).length > 0 ? true : false;

    const tieneAtributosOpcionales = (tienePernoExpansionConArgolla || tienePernoExpansionSinArgolla || tieneDetallesEscaleras);
    console.log({
        tieneAtributosOpcionales,
        tienePernoExpansionConArgolla,
        tienePernoExpansionSinArgolla,
        tieneDetallesEscaleras
    })
  respuesta.atributos_opcionales = {
        tiene_atributos_opcionales: tieneAtributosOpcionales,
        data: tieneAtributosOpcionales? {
            perno_expansion_con_argolla: {
                tiene_perno_expansion_con_argolla: tienePernoExpansionConArgolla,
                data: tienePernoExpansionConArgolla ? {
                    ...pdfCotizacionDataSnapshot?.perno_expansion_con_argolla
                } : {}
            },
            perno_expansion_sin_argolla: {
                tiene_perno_expansion_sin_argolla: tienePernoExpansionSinArgolla,
                data: tienePernoExpansionSinArgolla ? {
                    ...pdfCotizacionDataSnapshot?.perno_expansion_sin_argolla
                } : {}
            },
            detalles_escaleras: {
                tiene_detalles_escaleras: tieneDetallesEscaleras,
                data: tieneDetallesEscaleras ? {
                    ...pdfCotizacionDataSnapshot?.detalles_escaleras
                } : {}
            },
        } : {}
    };
  
  return respuesta;
}

module.exports = {
  mapearDataEscuadrasConPlataformas,
};
