export function validarObra(obra) {
    const errores = {};
  
    if (!obra.nombre || obra.nombre.trim() === "") {
      errores.nombre = "El nombre de la obra es obligatorio";
    }
  
    if (!obra.direccion || obra.direccion.trim() === "") {
      errores.direccion = "La dirección es obligatoria";
    }
  
    return errores;
  }  