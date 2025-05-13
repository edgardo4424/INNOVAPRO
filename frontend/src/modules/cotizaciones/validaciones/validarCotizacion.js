// INNOVA PRO+ v1.2.1

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

  if (paso === 3) {
    if (!datos.atributos || Object.keys(datos.atributos).length === 0) {
      errores.atributos = "Debes completar los atributos requeridos.";
    }
  }

  return errores;
}