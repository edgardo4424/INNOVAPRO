module.exports = class RegistrarCertificadoQuinta {
  constructor({ repo }) { this.repo = repo; }
  async execute(payload={}) {
    const { dni, anio } = payload;
    if (!dni || !anio) {
      const err = new Error('Parámetros inválidos (dni, anio)'); err.status=400; throw err;
    }
    const entidad = {
      dni, 
      anio:Number(anio),
      aplica_desde_mes: payload?.aplica_desde_mes ? Number(payload.aplica_desde_mes) : null,
      renta_bruta_total: Number(payload.renta_bruta_total || 0),
      retenciones_previas: Number(payload.retenciones_previas || 0),
      detalle_json: payload.detalle_json || null,
      archivo_url: payload.archivo_url || null,
      estado: payload.estado || 'VIGENTE'
    };
    const guardado = await this.repo.insertarPorDniAnio(entidad);
    return guardado.dataValues ?? guardado;
  }
}