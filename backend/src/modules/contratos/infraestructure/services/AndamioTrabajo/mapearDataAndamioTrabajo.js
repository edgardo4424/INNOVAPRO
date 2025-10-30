
 function mapearDataAndamioTrabajo({ pdfCotizacionDataSnapshot, respuesta }) {

  console.log('pdfCotizacionDataSnapshot', pdfCotizacionDataSnapshot);
 respuesta.usos.AT = {
    zonas: pdfCotizacionDataSnapshot?.zonas?.map((zona) => {
        const { atributos, ...resto} = zona;
        zona.equipos = atributos;
        delete zona.atributos;
        console.log('zona', zona);
        return zona;
    }) || [],
  }

  const tienePernoExpansionConArgolla = pdfCotizacionDataSnapshot?.atributos_opcionales?.cantidad_pernos_expansion > 0 ? true : false;

  if(tienePernoExpansionConArgolla){
      respuesta.activadores.tienePernosArgolla = true;
      respuesta.perno_expansion_con_argolla = {
        total: pdfCotizacionDataSnapshot?.atributos_opcionales?.cantidad_pernos_expansion,
        nombre: pdfCotizacionDataSnapshot?.atributos_opcionales?.nombre_perno_expansion,
        precio_venta_soles: pdfCotizacionDataSnapshot?.atributos_opcionales?.precio_perno_expansion,
      }
  }
  
  return respuesta;
}

module.exports = {
  mapearDataAndamioTrabajo,
};
