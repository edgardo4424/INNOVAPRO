
 function mapearDataAndamioTrabajo({ pdfCotizacionDataSnapshot, respuesta }) {

  console.log('pdfCotizacionDataSnapshot', pdfCotizacionDataSnapshot);
  respuesta.atributos_opcionales = {
        tiene_atributos_opcionales: pdfCotizacionDataSnapshot?.atributos_opcionales?.cantidad_pernos_expansion > 0  ? true : false,
        data: pdfCotizacionDataSnapshot?.atributos_opcionales?.cantidad_pernos_expansion > 0 ? {
            ...pdfCotizacionDataSnapshot?.atributos_opcionales
        } : {}
    };
  
  return respuesta;
}

module.exports = {
  mapearDataAndamioTrabajo,
};
