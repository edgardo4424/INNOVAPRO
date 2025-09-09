module.exports = class ObtenerCertificadoQuinta {
  constructor({ repo }) { this.repo = repo; }
  async execute({ dni, anio }) {
    if (!dni || !Number.isInteger(Number(anio))) {
      const err = new Error('Parámetros inválidos (dni, anio)'); err.status=400; throw err;
    }
    const fila = await this.repo.obtenerPorDniAnio({ dni, anio:Number(anio) });
    if (!fila) return { found:false };
    const filaData = fila.dataValues ?? fila;
    return {
      found:true,
      id: filaData.id,
      aplica_desde_mes: filaData.aplica_desde_mes || null,
      renta_bruta_total: Number(filaData.renta_bruta_total || 0),
      retenciones_previas: Number(filaData.retenciones_previas || 0),
      detalle_json: filaData.detalle_json || null,
      archivo_url: filaData.archivo_url || null,
      updatedAt: filaData.updated_at || filaData.updatedAt
    };
  }
}