module.exports=async(trabajadorRepository)=>{
    const trabajadores= await trabajadorRepository.obtenerTrabajadoresYcontratos();
    return{
        codigo:201,
        respuesta:{
            mensaje:"Se obtuvieron exitosamente los trabajadores.",
            trabajadores
        }
    }
}