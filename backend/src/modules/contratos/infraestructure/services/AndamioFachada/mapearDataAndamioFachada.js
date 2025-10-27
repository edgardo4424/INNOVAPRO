
 function mapearDataAndamioFachada({ pdfCotizacionDataSnapshot, respuesta }) {

    
  console.log('pdfCotizacionDataSnapshot AndamioFachada', pdfCotizacionDataSnapshot);

  const tienePernoExpansionConArgolla = pdfCotizacionDataSnapshot?.perno_expansion_con_argolla?.total > 0 ? true : false;
const tienePuntales = pdfCotizacionDataSnapshot?.detalles_puntales?.cantidad > 0 ? true : false;

if(tienePernoExpansionConArgolla){
    respuesta.perno_expansion_con_argolla = {
        ...pdfCotizacionDataSnapshot?.perno_expansion_con_argolla
    }
}

if(tienePuntales){
    respuesta.detalles_puntales = {
        ...pdfCotizacionDataSnapshot?.detalles_puntales
    }
}


/*   respuesta.atributos_opcionales = {
        tiene_atributos_opcionales: ( || pdfCotizacionDataSnapshot?.detalles_puntales?.cantidad > 0) ? true : false,
        data: {
            perno_expansion_con_argolla: {
                tiene_perno_expansion_con_argolla: pdfCotizacionDataSnapshot?.perno_expansion_con_argolla?.total > 0 ? true : false,
                data: pdfCotizacionDataSnapshot?.perno_expansion_con_argolla ? {
                    ...pdfCotizacionDataSnapshot?.perno_expansion_con_argolla
                } : {},
            },
            puntales: {
                tiene_puntales: pdfCotizacionDataSnapshot?.detalles_puntales?.cantidad > 0 ? true : false,
                data: pdfCotizacionDataSnapshot?.detalles_puntales?.cantidad > 0 ? {
                    ...pdfCotizacionDataSnapshot?.detalles_puntales
                } : {},
            }
            
        }
    }; */
  
  return respuesta;
}

module.exports = {
  mapearDataAndamioFachada,
};
