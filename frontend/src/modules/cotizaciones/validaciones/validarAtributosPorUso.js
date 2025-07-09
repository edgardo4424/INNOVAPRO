const ATRIBUTOS_REQUERIDOS_POR_USO = {
  // Ejemplo: uso_id: [campos_obligatorios]
  2: ["longitud", "ancho", "altura"], // Andamio de trabajo
  3: ["alturaTotal"], // Escalera de acceso
  5: ["cantidad", "tipoPuntal"], // Puntales
  // Puedes seguir agregando más usos aquí
};

export function validarAtributosPorUso(formData) {
  const usoId = formData.uso_id;
  const zonas = formData.zonas || [];

  const requeridos = ATRIBUTOS_REQUERIDOS_POR_USO[usoId];
  if (!requeridos) return { valido: true }; // si no hay reglas definidas, se permite

  let errores = [];

  zonas.forEach((zona, i) => {
    const attrs = zona.atributos_formulario?.[0] || {};
    requeridos.forEach((campo) => {
      const valor = attrs[campo];
      if (!valor || valor.trim?.() === "") {
        errores.push(`Falta "${campo}" en zona ${zona.zona || i + 1}`);
      }
    });
  });

  return {
    valido: errores.length === 0,
    errores,
  };
}
