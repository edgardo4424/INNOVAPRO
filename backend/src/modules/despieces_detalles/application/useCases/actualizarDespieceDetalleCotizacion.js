module.exports = async (
  cotizacion_id,
  nuevo_despiece_detalles,
  despieceDetalleRepository,
  transaction = null
) => {
    console.log("Entro ala funcion");
    
  const nuevo_despiece =
    await despieceDetalleRepository.actualizarDespieceDetalleCotizacion(
      cotizacion_id,
      nuevo_despiece_detalles,
      transaction
    );
    console.log("Nuevo depsice",nuevo_despiece);
    
    return{
        codigo:202,
        respuesta:{
            nuevo_despiece
        }
    }
};
