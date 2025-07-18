export function extraerDistrito(direccion) {
  if (!direccion) return "";
  const partes = direccion.split(",").map(p => p.trim());
  const posibles = partes.slice().reverse();

  for (let parte of posibles) {
    const sinNumeros = parte.replace(/[0-9]/g, "").trim();
    if (sinNumeros.length > 1 && !sinNumeros.includes("PERÚ")) {
      return sinNumeros.toUpperCase();
    }
  }

  return "";
}