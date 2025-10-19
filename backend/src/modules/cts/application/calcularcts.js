module.exports = async (periodo, anio, filial_id, ctsRepository,trabajadorRepository) => {

    const hoy = new Date().toISOString().slice(0, 10);

    if (!['MAYO','NOVIEMBRE'].includes(periodo)) {
      return { codigo: 400, respuesta: "Periodo no valido" }
    }
    const trabajadores= await trabajadorRepository.obtenerTrabajadoresYcontratos();
    let cts_calculadas=[]
    for (const t of trabajadores) {
        const contratoActual = t.contratos_laborales.find((c) => {
               return c.filial_id == filial_id&&hoy >= c.fecha_inicio && (c.es_indefinido?true:hoy <= c.fecha_fin);
        }); 
        if(contratoActual){
          const cts=await ctsRepository.calcularCtsIndividual(periodo,anio,filial_id,t.id);
          if(!cts[0]){
            return{
              codigo:402,
              respuesta:{
                mensaje:"Hubo un error en el caluclo de la cts "
              }
            }
          }
          cts_calculadas.push(cts[0])
        }
      
    }
    
    return { codigo: 200, respuesta: cts_calculadas } 
} 