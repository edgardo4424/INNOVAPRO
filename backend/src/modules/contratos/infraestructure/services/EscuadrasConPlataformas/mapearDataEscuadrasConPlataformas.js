
 function mapearDataEscuadrasConPlataformas({ pdfCotizacionDataSnapshot, respuesta }) {

  respuesta.activadores.anexoEC = true;
  
    respuesta.usos.EC = {
         zonas: pdfCotizacionDataSnapshot?.zonas?.map((zona) => {
                const { atributos, ...resto} = zona;
                zona.equipos = atributos;
                delete zona.atributos;
                return zona;
            }) || [],
    }

  const tieneEscuadras = pdfCotizacionDataSnapshot?.detalles_escuadras?.cantidad > 0 ? true : false;
const tienePlataformas = pdfCotizacionDataSnapshot?.detalle_plataformas?.cantidad > 0 ? true : false;
 
    if(tieneEscuadras){
        respuesta.usos.EC.detalles_escuadras = pdfCotizacionDataSnapshot?.detalles_escuadras || {}
    }
    if(tienePlataformas){
        respuesta.activadores.tienePlataformas = true;
        respuesta.usos.EC.detalles_plataformas = pdfCotizacionDataSnapshot?.detalle_plataformas || {}
    }
  return respuesta;
}

module.exports = {
  mapearDataEscuadrasConPlataformas,
};
