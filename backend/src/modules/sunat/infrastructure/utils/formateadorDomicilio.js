function formatearDomicilioSUNAT(datos, ubigeo) {
    if (!datos) return "";

    const via = `${datos.tipo_via || ""} ${datos.nombre_via || ""}`.trim();
    
    const zona = `${datos.codigo_zona || ""} ${datos.tipo_zona || ""}`.trim();
    
    const partes = [
        via,
        datos.numero && `NRO. ${datos.numero}`,
        datos.interior && `INT. ${datos.interior}`,
        datos.lote && `LOTE ${datos.lote}`,
        zona,
        ubigeo?.distrito,
        ubigeo?.provincia,
        ubigeo?.departamento,
      ];
    
      return partes.filter(Boolean).join(" - ").toUpperCase();
  }
  
  module.exports = { formatearDomicilioSUNAT };  