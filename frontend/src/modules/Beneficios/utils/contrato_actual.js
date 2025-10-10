export function obtenerContratoActual(contratos) {
  const hoy = new Date();
  
  // Busca los contratos en rango
  const contratosActuales = contratos.filter((c) => {
    const inicio = new Date(c.fecha_inicio);
    const fin = new Date(c.fecha_fin);
    return hoy >= inicio && c.es_indefinido?true:hoy <= fin;
  });

  if (!contratosActuales) return null; // Si no hay contrato vigente
  const nombre_filiales = [...new Set(contratosActuales.map(c => c.empresa_proveedora.razon_social))];
  
  return nombre_filiales
}
