module.exports = class RegistrarDeclaracionSinPrevios {
  constructor({ repo }) { this.repo = repo; }
  async execute(payload={}) {
    const { dni, anio } = payload;
    if (!dni || !Number.isInteger(Number(anio))) {
      const err = new Error('Parámetros inválidos (dni, anio)'); err.status = 400; throw err;
    }
    const aplicaDesdeMes = Number(payload?.aplica_desde_mes);
    if (!aplicaDesdeMes || aplicaDesdeMes < 1 || aplicaDesdeMes > 12) {
      const err = new Error('aplica_desde_mes (1...12) es obligatorio'); err.status=400; throw err;
    }
    const entidad = {
      dni, 
      anio:Number(anio),
      aplica_desde_mes: aplicaDesdeMes,
      archivo_url: payload.archivo_url || null,
      observaciones: payload.observaciones || null,
      estado: payload.estado || 'VIGENTE'
    };
    const guardado = await this.repo.insertarPorDniAnio(entidad);
    return guardado.dataValues ?? guardado;
  }
}