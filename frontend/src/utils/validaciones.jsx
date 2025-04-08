  // 8 caracteres, una mayúscula y una minúscula
export function validarPassword(password) {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regexPassword.test(password);
  }
  
  // Solo letras y espacios
  export function validarTextoLetras(value) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/;
    return regex.test(value);
  }
  
  // Letras, espacios, puntos, comas, guiones
  export function validarRazonSocial(value) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ., \\-\\s]+$/;
    return regex.test(value);
  }

  {/* Dirección - Permite letras, números y caracteres básicos */}
  export function validarDireccion(value) {
    // Solo permite letras, números, tildes, puntos, comas, guiones y espacios
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,\-\s]+$/;
    return regex.test(value);
  }
  

  // Email
  export function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }  

  // Solo números exactos
export function validarNumeroExacto(value, longitud) {
  const regex = new RegExp(`^\\d{${longitud}}$`);
  return regex.test(value);
}

// RUC (exactamente 11 dígitos)
export function validarRUC(ruc) {
  return validarNumeroExacto(ruc, 11);
}

// DNI (exactamente 8 dígitos)
export function validarDNI(dni) {
  return validarNumeroExacto(dni, 8);
}

// CE (máximo 12 caracteres alfanuméricos)
export function validarCE(ce) {
  return /^[a-zA-Z0-9]{1,12}$/.test(ce);
}

// Pasaporte (máximo 9 caracteres alfanuméricos)
export function validarPasaporte(pasaporte) {
  return /^[a-zA-Z0-9]{1,9}$/.test(pasaporte);
}

// Teléfono (exactamente 9 dígitos)
export function validarTelefono(telefono) {
  return validarNumeroExacto(telefono, 9);
}