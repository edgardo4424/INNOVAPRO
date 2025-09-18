module.exports = class ObtenerCertificadoQuinta {
  constructor({ repo }) { this.repo = repo; }
  async execute({ dni, anio }) {
    if (!dni || !anio) {
      const err = new Error('Parámetros inválidos (dni, anio)'); err.status = 400; throw err;
    }

    const fila = await this.repo.obtenerPorDniAnio({ dni, anio });

    if (!fila || fila.found !== true) {
      return { found: false };
    }

    return {
      found: true,
      id: fila.id,
      aplica_desde_mes: fila.aplica_desde_mes ?? null,
      empresa_ruc: fila.empresa_ruc || '',
      empresa_razon_social: fila.empresa_razon_social || '',
      fecha_emision: fila.fecha_emision || null,
      renta_bruta_total: Number(fila.renta_bruta_total || 0),
      remuneraciones: Number(fila.remuneraciones || 0),
      gratificaciones: Number(fila.gratificaciones || 0),
      otros: Number(fila.otros || 0),
      asignacion_familiar: Number(fila.asignacion_familiar || 0),
      retenciones_previas: Number(fila.retenciones_previas || 0),
      detalle_json: fila.detalle_json || null,
      archivo_url: fila.archivo_url || null,
      updatedAt: fila.updated_at || fila.updatedAt || null,
    };
  }
};