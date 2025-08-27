export function obtenerContratoActual(contratos) {
  const hoy = new Date();

  // Busca el contrato cuyo rango de fechas incluya hoy
  const contratoActual = contratos.find((c) => {
    const inicio = new Date(c.fecha_inicio);
    const fin = new Date(c.fecha_fin);
    return hoy >= inicio && hoy <= fin;
  });

  if (!contratoActual) return null; // Si no hay contrato vigente

  
  return contratoActual.empresa_proveedora
}
