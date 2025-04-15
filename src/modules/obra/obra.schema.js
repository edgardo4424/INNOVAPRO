/**
 * Verifica si los campos mínimos obligatorios están presentes.
 * Aplica para cualquier entidad tipo Persona (cliente, proveedor, etc.)
 */
function validarCamposObligatorios(datos) {

    const { nombre, email, telefono, cargo, clientes: clientesIds, obras: obrasIds } = datos;

    if (!nombre || !email) {
        throw ErrorPersonalizado("Nombre y email son obligatorios", 400)
    }

    return null
}

const contactoCreateSchema = (data) => {
    const errorCampos = validarCamposObligatorios(data)
    if(!errorCampos) return data;
};

const contactoUpdateSchema = (data) => {
    const errorCampos = validarCamposObligatorios(data)
    if(!errorCampos) return data;
};

module.exports = {
    contactoCreateSchema,
    contactoUpdateSchema,
};