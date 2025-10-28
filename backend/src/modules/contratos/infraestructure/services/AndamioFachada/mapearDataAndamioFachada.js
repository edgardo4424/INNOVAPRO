
 function mapearDataAndamioFachada({ pdfCotizacionDataSnapshot, respuesta }) {

  respuesta.usos.AF = {
    zonas: pdfCotizacionDataSnapshot?.zonas?.map((zona) => {
        const { atributos, ...resto} = zona;
        zona.equipos = atributos;
        delete zona.atributos;
        console.log('zona', zona);
        return zona;
    }) || [],
  }

  const tienePernoExpansionConArgolla = pdfCotizacionDataSnapshot?.perno_expansion_con_argolla?.total > 0 ? true : false;
const tienePuntales = pdfCotizacionDataSnapshot?.detalles_puntales?.puntal?.cantidad > 0 ? true : false;

if(tienePernoExpansionConArgolla){
    respuesta.activadores.tienePernosArgolla = true;
    respuesta.perno_expansion_con_argolla = {
        ...pdfCotizacionDataSnapshot?.perno_expansion_con_argolla
    }
}

if(tienePuntales){
    respuesta.activadores.tienePuntales = true;
    respuesta.detalles_puntales = {
        ...pdfCotizacionDataSnapshot?.detalles_puntales
    }
}
  
  return respuesta;
}

module.exports = {
  mapearDataAndamioFachada,
};
