export async function formatearBorrador(tipo, borrador, usuario_id) {


    const nuevoBorrador = {}

    if(tipo == 'factura' || tipo == 'boleta' || tipo == 'notaCredito' || tipo == 'notaDebito' || tipo == 'guiaRemision') {
        nuevoBorrador.tipo_borrador = tipo
        nuevoBorrador.serie = borrador.serie
        nuevoBorrador.correlativo = borrador.correlativo
        nuevoBorrador.empresa_ruc = borrador.empresa_Ruc
        nuevoBorrador.cliente_num_doc = borrador.cliente_Num_Doc
        nuevoBorrador.cliente_razon_social = borrador.cliente_Razon_Social
        nuevoBorrador.fecha_Emision = borrador.fecha_Emision
        nuevoBorrador.body = JSON.stringify(borrador)
        nuevoBorrador.usuario_id = usuario_id
        }



    return nuevoBorrador

}