
 function mapearDataEscaleraAcceso({ pdfCotizacionDataSnapshot, respuesta }) {

  respuesta.activadores.anexoEA = true;
  
    respuesta.usos.EA = {
    zonas: pdfCotizacionDataSnapshot?.zonas?.map((zona) => {
        const { atributos, ...resto} = zona;
        zona.equipos = atributos;
        delete zona.atributos;
        console.log('zona', zona);
        return zona;
    }) || [],
  }

  const tienePernoExpansionConArgolla = pdfCotizacionDataSnapshot?.perno_expansion_con_argolla?.total > 0 ? true : false;
const tienePernoExpansionSinArgolla = pdfCotizacionDataSnapshot?.perno_expansion_sin_argolla?.total > 0 ? true : false;
const tieneDetallesEscaleras = Object.keys(pdfCotizacionDataSnapshot?.detalles_escaleras || {}).length > 0 ? true : false;

if(tienePernoExpansionConArgolla){
    respuesta.activadores.tienePernosArgolla = true;
    respuesta.perno_expansion_con_argolla = {
        ...pdfCotizacionDataSnapshot?.perno_expansion_con_argolla
    }
}
if(tienePernoExpansionSinArgolla){
    respuesta.activadores.tienePernosSinArgolla = true;
    respuesta.perno_expansion_sin_argolla = {
        ...pdfCotizacionDataSnapshot?.perno_expansion_sin_argolla
    }
}
if(tieneDetallesEscaleras){
    respuesta.usos.EA.detalles_escaleras = {
        ...pdfCotizacionDataSnapshot?.detalles_escaleras
    }
}

   const unirEscaleras = unirEscalerasPorPosicion(respuesta.usos.EA);

    const zonasConEquiposConTextoDeLosTramos = unirEscaleras.zonas.map(zona => {
        zona.equipos = zona.equipos.map(equipo => {
            return {
                ...equipo,
                tramos_2m_y_1m_combinados_texto: `${equipo.tramos_2m > 0 ? `${equipo.tramos_2m} ${equipo.tramos_2m > 1 ? 'tramos' : 'tramo'} de 2.00 m` : ''}${equipo.tramos_1m > 0 ? `${equipo.tramos_2m > 0 ? ' y ' : ''}${equipo.tramos_1m} ${equipo.tramos_1m > 1 ? 'tramos' : 'tramo'} de 1.00 m` : ''}`,
            } 
        })
        return zona;
    })

    respuesta.usos.EA.zonas = zonasConEquiposConTextoDeLosTramos;
  return respuesta;
}

function unirEscalerasPorPosicion(data) {
  if (!data.zonas || !data.detalles_escaleras) return data;

  data.zonas = data.zonas.map(zona => {
    // Busca la escalera que corresponde a esta zona
    const escaleraZona = data.detalles_escaleras.escaleras.find(
      e => e.zona === zona.zona
    );

    if (!escaleraZona) return zona; // no hay escaleras para esta zona

    zona.equipos = zona.equipos.map((eq, index) => {
      const escaleraEq = escaleraZona.equipos[index]; // 💡 por posición
      return escaleraEq ? { ...eq, ...escaleraEq } : eq;
    });

    return zona;
  });

  return data;
}

module.exports = {
  mapearDataEscaleraAcceso,
};
