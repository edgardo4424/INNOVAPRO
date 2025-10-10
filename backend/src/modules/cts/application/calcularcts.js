module.exports = async (periodo, anio, filial_id, ctsRepository,trabajadorRepository) => {

    const hoy = new Date().toISOString().slice(0, 10);

    if (!['MAYO','NOVIEMBRE'].includes(periodo)) {
      return { codigo: 400, respuesta: "Periodo no valido" }
    }
    const trabajadores= await trabajadorRepository.obtenerTrabajadoresYcontratos();
    
    for (const t of trabajadores) {
      if(t.id<10){
        const contratoActual = t.contratos_laborales.find((c) => {
               return hoy >= c.fecha_inicio && (c.es_indefinido?true:hoy <= c.fecha_fin);
        }); 
        if(contratoActual){
          const cts=await ctsRepository.calcularCtsIndividual(periodo,anio,filial_id,t.id);
          console.log("Cts obtenida",cts);
            
        }
      }


    }
    
    const cts = await ctsRepository.calcularCts(periodo, anio, filial_id); 
    return { codigo: 200, respuesta: cts } 
} 