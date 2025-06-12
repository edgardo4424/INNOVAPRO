// INNOVA PRO+ v1.3.1

export default function validarCotizacion(paso, datos) {
  const errores = {};

  if (paso === 0) {
    if (!datos.contacto_id) {
      errores.contacto = "Debes seleccionar un contacto.";
    }
  }

  if (paso === 1) {
    if (!datos.filial_id) {
      errores.filial = "Debes seleccionar una filial.";
    }
  }

  if (paso === 2) {
    if (!datos.uso_id) {
      errores.uso_id = "Debes seleccionar el uso que deseas cotizar.";
    }
  }

  if (paso === 4) {
    if (
      !datos.zonas ||
      datos.zonas.length === 0 ||
      datos.zonas.some(z => !Array.isArray(z.atributos_formulario) || z.atributos_formulario.length === 0)
    ) {
      errores.atributos = "Cada zona debe tener al menos un equipo configurado.";
    }
  }

  return errores;
}