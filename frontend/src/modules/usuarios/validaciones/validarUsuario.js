export function validarUsuario(usuario, opciones = {}) {
    const errores = {};
  
    if (!usuario.nombre || usuario.nombre.trim() === "") {
      errores.nombre = "El nombre es obligatorio";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(usuario.nombre)) {
      errores.nombre = "Solo se permiten letras y espacios";
    }
  
    if (!usuario.email || usuario.email.trim() === "") {
      errores.email = "El correo es obligatorio";
    } else if (
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(usuario.email)
    ) {
      errores.email = "Correo electrónico no válido";
    }
  
    if (!opciones.editar) {
      if (!usuario.password || usuario.password.trim() === "") {
        errores.password = "La contraseña es obligatoria";
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(usuario.password)
      ) {
        errores.password =
          "Debe tener al menos 8 caracteres, incluir mayúscula, minúscula y número";
      }
    }
  
    if (!usuario.rol || usuario.rol.trim() === "") {
      errores.rol = "Debes seleccionar un rol";
    }
  
    return errores;
  }  