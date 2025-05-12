class Despiece { 
    constructor({
        subtotal, 
        porcentaje_descuento, 
        subtotal_con_descuento, 
        igv_porcentaje, 
        igv_monto, 
        total_final,
    }) {
        this.subtotal = subtotal;
        this.porcentaje_descuento = porcentaje_descuento;
        this.subtotal_con_descuento = subtotal_con_descuento;
        this.igv_porcentaje = igv_porcentaje;
        this.igv_monto = igv_monto;
        this.total_final = total_final
    }

    static validarCamposObligatorios(datos, modo = "crear") {
        /* if (modo === "crear") {
            if (!datos.subtotal || !datos.porcentaje_descuento || !datos.subtotal_con_descuento || !datos.igv_porcentaje || !datos.igv_monto || !datos.total_final) {
                return "Faltan campos obligatorios: subtotal, porcentaje_descuento, subtotal_con_descuento, igv_porcentaje, igv_monto y/o total_final.";
            }
        }
 */
        if (modo === "editar") {
            const tieneAlMenosUnCampoValido = ["subtotal", "porcentaje_descuento", "subtotal_con_descuento", "igv_porcentaje", "igv_monto", "total_final"].some(
                (campo) => 
                    datos[campo] !== undefined && 
                    datos[campo] !== null && 
                    datos[campo] !== ""
            );

            if (!tieneAlMenosUnCampoValido) {
                return "Debe proporcionar al menos un campo válido para actualizar.";
            }
        }

        return null;
    }


}

module.exports = Despiece; // Exportamos la clase Despiece para su uso en otros módulos