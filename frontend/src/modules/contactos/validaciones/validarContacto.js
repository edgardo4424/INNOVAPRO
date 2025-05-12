export const validarContacto = (contacto) => {
    const errores = {};
  
    if (!contacto.nombre || contacto.nombre.trim().length < 2) {
      errores.nombre = "El nombre es obligatorio y debe tener al menos 2 caracteres.";
    }
  
    if (!contacto.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto.email)) {
      errores.email = "Correo inválido.";
    }
  
    if (!contacto.telefono || contacto.telefono.length !== 9) {
      errores.telefono = "El teléfono debe tener 9 dígitos.";
    }
  
    if (!contacto.cargo || contacto.cargo.trim().length < 2) {
      errores.cargo = "El cargo es obligatorio.";
    }
  
    return errores;
  };  