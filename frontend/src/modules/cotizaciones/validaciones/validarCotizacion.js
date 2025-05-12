// INNOVA PRO+ v1.2.0

export default function validarCotizacion(paso, datos) {
    const errores = {};
  
    if (paso === 0) {
      if (!datos.cliente || datos.cliente.trim() === "") {
        errores.cliente = "El cliente es obligatorio.";
      }
      if (!datos.obra || datos.obra.trim() === "") {
        errores.obra = "La obra es obligatoria.";
      }
      if (!datos.contacto || datos.contacto.trim() === "") {
        errores.contacto = "El contacto es obligatorio.";
      }
    }
  
    if (paso === 1) {
      if (!datos.uso_id) {
        errores.uso_id = "Debes seleccionar el uso.";
      }
      if (!datos.atributos || Object.keys(datos.atributos).length === 0) {
        errores.atributos = "Debes completar los atributos requeridos.";
      }
    }
  
    return errores;
  }  