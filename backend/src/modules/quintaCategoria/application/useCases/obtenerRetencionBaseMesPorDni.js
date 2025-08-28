// Devuelve la retención BASE del mes para un DNI/año/mes.
// Regla: “vigente del mes” = último registro creado (createdAt DESC) para ese año/mes.
module.exports = class ObtenerRetencionBaseMesPorDni {
  constructor({ repo }) {
    this.repo = repo; 
  }

  /**
   * @param {Object} params
   * @param {string} params.dni
   * @param {number} params.anio
   * @param {number} params.mes 
   * @returns {Promise<{found:boolean, retencion_base_mes:number|null, registro?:any}>}
   */
  async execute({ dni, anio, mes }) {
    if (!dni || !Number.isInteger(Number(anio)) || !Number.isInteger(Number(mes))) {
      const err = new Error('Parámetros inválidos (dni, anio, mes)');
      err.status = 400;
      throw err;
    }

    const reg = await this.repo.findUltimoVigentePorDniMes({ dni, anio: Number(anio), mes: Number(mes) });
    if (!reg) return { found: false, retencion_base_mes: null };

    // Normaliza nombre de campo por si vienes con dataValues
    const row = reg.dataValues ? reg.dataValues : reg;

    return {
      found: true,
      retencion_base_mes: Number(row.retencion_base_mes || 0),
      // Si los chicos quieren que les devuelva algo más lo devolvemos (id, createdAt, es_recalculo), lo dejas disponible:
      registro: {
        id: row.id,
        es_recalculo: !!row.es_recalculo,
        createdAt: row.createdAt || row.created_at,
      },
    };
  }
};