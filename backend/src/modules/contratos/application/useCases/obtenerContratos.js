module.exports = async (contratoRepository, transaction = null) => {
    const contratos = await contratoRepository.obtenerContratos(transaction); // Llama al método del repositorio para obtener todos los contratos
  
     const listaContratos = contratos.map((contrato) => {

        const {id, ref_contrato, fecha_inicio, fecha_fin, estado_condiciones, estado, cliente, obra, usuario, uso, despiece, cotizacion, ...resto} = contrato;

        const informacion_trabajador = {
            id: usuario.id,
            nombres: usuario.trabajador.nombres,
            apellidos: usuario.trabajador.apellidos
        };

        return {
            id,
            ref_contrato,
            fecha_inicio,
            fecha_fin,
            estado_condiciones,
            estado,
            cliente,
            obra,
            usuario: informacion_trabajador,
            uso,
            despiece,
            tipo: cotizacion?.tipo_cotizacion
        }
    })
    return { codigo: 200, respuesta: listaContratos } 
} // Exporta la función para que pueda ser utilizada en otros módulos