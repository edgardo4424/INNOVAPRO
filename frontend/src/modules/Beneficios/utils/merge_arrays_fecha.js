export const mergeTipoByFecha = (arr1, arr2) => {
  // Creamos un mapa para buscar rápidamente por fecha
  const tipoMap = new Map(arr2.map(item => [item.fecha, item.tipo]));
    
  // Recorremos arr1 y agregamos el tipo si existe
  return arr1.map(item => ({
    ...item,
    tipo: tipoMap.get(item.fecha) || ''  // si no hay, ponemos ''
  }));
};

