export function validarEmpresa(empresa) {
    const errores = {};
  
    if (!empresa.razon_social || empresa.razon_social.trim() === "") {
      errores.razon_social = "La razón social es obligatoria";
    }
  
    if (!empresa.ruc || empresa.ruc.length !== 11) {
      errores.ruc = "El RUC debe tener 11 dígitos";
    }
  
    if (!empresa.direccion || empresa.direccion.trim() === "") {
      errores.direccion = "La dirección fiscal es obligatoria";
    }
  
    if (!empresa.representante_legal || empresa.representante_legal.trim() === "") {
      errores.representante_legal = "El representante legal es obligatorio";
    }

     if (!empresa.tipo_documento || empresa.representante_legal.trim() === "") {
      errores.representante_legal = "El tipo de documento es obligatorio";
    }
  
    if (!empresa.dni_representante || empresa.dni_representante.trim() === "") {
      errores.dni_representante = "El número de documento es obligatorio";
    }
  
    if (!empresa.cargo_representante || empresa.cargo_representante.trim() === "") {
      errores.cargo_representante = "El cargo del representante es obligatorio";
    }
  
    if (empresa.telefono_representante && empresa.telefono_representante.length !== 9) {
      errores.telefono_representante = "El teléfono del representante debe tener 9 dígitos";
    }
  
    if (empresa.telefono_oficina && empresa.telefono_oficina.length !== 9) {
      errores.telefono_oficina = "El teléfono de oficina debe tener 9 dígitos";
    }
  
    return errores;
  }  