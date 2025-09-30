const SequelizeCalculoQuintaCategoriaRepository = require('../../infrastructure/repositories/SequelizeQuintaCategoriaRepository');

const repo = new SequelizeCalculoQuintaCategoriaRepository();

// Extrae anio/mes/filial de body o de params/query según endpoint
function _resolverPeriodoFilial(req) {
  const b = req.body || {};

  const anio = Number(b.anio);
  const mes  = Number(b.mes);
  const periodo = (anio && mes ? `${String(anio).padStart(4,'0')}-${String(mes).padStart(2,'0')}` : null);
  const filialId = Number(b.filialId);

  return { periodo, filialId, anio, mes };
}

module.exports = async function bloqueoCierreQuinta(req, res, next) {
  try {
    const { periodo, filialId, anio, mes } = _resolverPeriodoFilial(req);
   
    if (!filialId || (!periodo && (!anio || !mes))) {
      return res.status(400).json({ ok: false, message: 'Parámetros insuficientes para validar cierre (filial y período).' });
    }
    const cerrado = await repo.estaCerrado({ filialId, periodo, anio, mes });
    if (cerrado) {
      return res.status(409).json({
        ok: false,
        message: `El período ${periodo ?? `${anio}-${String(mes).padStart(2,'0')}`} está cerrado para esa filial. `
      });
    }
    next();
  } catch (err) {
    console.error('bloqueoCierreQuinta error:', err);
    return res.status(500).json({ ok: false, message: 'Error validando cierre de quinta.' });
  }
};