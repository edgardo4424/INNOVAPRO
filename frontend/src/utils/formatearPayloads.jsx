export function limpiarCamposVacios(obj) {
    const limpio = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        limpio[key] = value;
      }
    });
    return limpio;
  }
  