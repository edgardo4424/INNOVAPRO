module.exports = class ObtenerDeclaracionSinPrevios {
  constructor({ repo }) { this.repo = repo; }
  async execute({ dni, anio }) {
    if (!dni || !Number.isInteger(Number(anio))) {
      const err = new Error('Parámetros inválidos (dni, anio)'); err.status=400; throw err;
    }
    const fila = await this.repo.obtenerPorDniAnio({ dni, anio:Number(anio) });
    if(!fila) return { found: false };
    const filaData = fila.dataValues ?? fila;
    return { 
        found: true,
        id: filaData.id,
        aplica_desde_mes: filaData.aplica_desde_mes || null,
        observaciones: filaData.observaciones || null,
        archivo_url: filaData.archivo_url || null,
        updateAt: filaData.update_at || filaData.updateAt
    };
  }
}
