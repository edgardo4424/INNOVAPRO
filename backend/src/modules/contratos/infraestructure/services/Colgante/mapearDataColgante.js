
 function mapearDataColgante({ pdfCotizacionDataSnapshot, respuesta }) {

  respuesta.activadores.anexoAE = true;
  
  respuesta.atributos_opcionales = {
        tiene_atributos_opcionales: pdfCotizacionDataSnapshot?.detalles_colgantes && Object.keys(pdfCotizacionDataSnapshot?.detalles_colgantes).length > 0 ? true : false,
        data: pdfCotizacionDataSnapshot?.detalles_colgantes ? {
            ...pdfCotizacionDataSnapshot?.detalles_colgantes
        } : {}
    };
  
  return respuesta;
}

module.exports = {
  mapearDataColgante,
};
