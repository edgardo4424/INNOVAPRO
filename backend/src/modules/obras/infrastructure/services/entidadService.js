
/**
 * Verifica si los campos mínimos obligatorios están presentes.
 */
function validarCamposObligatorios(datos) {
  const { nombre, direccion, ubicacion, estado } = datos;

  if (!nombre || !direccion || !ubicacion || !estado) {
    return "Todos los campos son obligatorios";
  }

  return null;
}

module.exports = {
  validarCamposObligatorios,
};
