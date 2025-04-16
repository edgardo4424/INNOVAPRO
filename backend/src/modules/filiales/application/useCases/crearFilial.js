module.exports = async (filialData, filialRepository, entidadService) => {
  const errorCampos = entidadService.validarCamposObligatorios(filialData);

  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; // Validamos campos obligatorios

  // Validar si ya existe una filial con ese RUC
  const filialExistente = await filialRepository.obtenerPorRuc(filialData.ruc);
 
  if (filialExistente) {
    return {
      codigo: 400,
      respuesta: {
        mensaje:
          "El RUC ingresado ya está registrado en otra empresa proveedora.",
      },
    };
  }

  const nuevoFilialData = {
    razon_social: filialData.razon_social,
    ruc: filialData.ruc,
    direccion: filialData.direccion,
    representante_legal: filialData.representante_legal,
    dni_representante: filialData.dni_representante,
    cargo_representante: filialData.cargo_representante,
    telefono_representante: filialData.telefono_representante,
    telefono_oficina: filialData.telefono_oficina || null,
    creado_por: filialData.creado_por,
  };

  const nuevoFilial = await filialRepository.crear(nuevoFilialData); // Creamos el nuevo filial con todos sus datos en la base de datos

  return {
    codigo: 201,
    respuesta: { mensaje: "Filial creado exitosamente", empresa: nuevoFilial },
  }; // Retornamos el cliente creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
