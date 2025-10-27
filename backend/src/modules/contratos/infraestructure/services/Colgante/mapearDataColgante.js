
 function mapearDataColgante({ pdfCotizacionDataSnapshot, contrato, respuesta }) {

  console.log('pdfCotizacionDataSnapshot', pdfCotizacionDataSnapshot);
  respuesta.atributos_opcionales = {
        tiene_atributos_opcionales: pdfCotizacionDataSnapshot?.detalles_colgantes && Object.keys(pdfCotizacionDataSnapshot?.detalles_colgantes).length > 0 ? true : false,
        data: pdfCotizacionDataSnapshot?.detalles_colgantes ? {
            ...pdfCotizacionDataSnapshot?.detalles_colgantes
        } : {}
    };
  
  console.log("respuesta en mapearDataColgante:", respuesta);
  return respuesta;
}

module.exports = {
  mapearDataColgante,
};
