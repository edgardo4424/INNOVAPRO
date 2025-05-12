import {
    validarRazonSocial,
    validarRUC,
    validarDNI,
    validarCE,
    validarPasaporte,
    validarTextoLetras,
    validarDireccion,
    validarTelefono,
    validarEmail,
  } from "../../../utils/validaciones";
  
  // 🔍 Validar un campo según tipo de documento
  function validarDocumento(tipo, valor) {
    switch (tipo) {
      case "DNI":
        return validarDNI(valor);
      case "CE":
        return validarCE(valor);
      case "Pasaporte":
        return validarPasaporte(valor);
      default:
        return false;
    }
  }
  
  // 🔎 Validación para Persona Jurídica
  export function validarClienteJuridico(cliente) {
    const errores = {};
  
    if (!validarRazonSocial(cliente.razon_social)) {
      errores.razon_social = "Razón social inválida";
    }
  
    if (!validarRUC(cliente.ruc)) {
      errores.ruc = "RUC inválido";
    }
  
    if (!validarTextoLetras(cliente.representante_legal)) {
      errores.representante_legal = "Nombre del representante inválido";
    }
  
    if (!validarDocumento(cliente.tipo_documento, cliente.dni_representante)) {
      errores.dni_representante = "Documento del representante inválido";
    }
  
    if (!validarDireccion(cliente.domicilio_fiscal)) {
      errores.domicilio_fiscal = "Dirección inválida";
    }
  
    if (!validarTelefono(cliente.telefono)) {
      errores.telefono = "Teléfono inválido";
    }
  
    if (!validarEmail(cliente.email)) {
      errores.email = "Correo inválido";
    }
  
    return errores;
  }
  
  // 🔎 Validación para Persona Natural
  export function validarClienteNatural(cliente) {
    const errores = {};
  
    if (!validarRazonSocial(cliente.razon_social)) {
      errores.razon_social = "Nombre completo inválido";
    }
  
    if (!validarDocumento(cliente.tipo_documento, cliente.dni)) {
      errores.dni = "Documento inválido";
    }
  
    if (!validarTelefono(cliente.telefono)) {
      errores.telefono = "Teléfono inválido";
    }
  
    if (!validarEmail(cliente.email)) {
      errores.email = "Correo inválido";
    }
  
    return errores;
  }  