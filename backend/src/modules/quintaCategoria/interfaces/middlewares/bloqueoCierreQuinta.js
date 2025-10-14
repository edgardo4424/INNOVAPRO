const SequelizeCalculoQuintaCategoriaRepository = require('../../infrastructure/repositories/SequelizeQuintaCategoriaRepository');

const repo = new SequelizeCalculoQuintaCategoriaRepository();

function _periodoStr({ anio, mes }) {
  if (!anio || !mes) return null;
  return `${String(anio).padStart(4,'0')}-${String(mes).padStart(2,'0')}`;
}

function _num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

// Extrae anio/mes/filial de body o de params/query según endpoint
async function _resolverPeriodoFilial(req) {
  const b = req.body || {};

  const anio = _num(b.anio);
  const mes  = _num(b.mes);
  const periodo = _periodoStr({ anio, mes })
  const filialId =
    _num(b.filialId) ??
    _num(b.__filialId) ??
    _num(b.filial_id);

  if ((!filialId || !periodo) && req.params?.id) {
    const row = await repo.findById(req.params.id);
    if (row) {
      return {
        filialId: filialId ?? _num(row.filial_id),
        anio: anio ?? _num(row.anio),
        mes: mes ?? _num(row.mes),
        periodo: _periodoStr({ anio: anio ?? row.anio, mes: mes ?? row.mes }),
        _fromRow: true,
      };
    }
  }

  return { filialId, anio, mes, periodo, _fromRow: false };
}

module.exports = async function bloqueoCierreQuinta(req, res, next) {
  try {
    const { filialId, periodo, anio, mes, _fromRow } = await _resolverPeriodoFilial(req);

    if (!filialId || !(periodo || (anio && mes))) {
      return res.status(400).json({
        ok: false,
        message: 'Parámetros insuficientes para validar cierre: se requiere filial y período (anio/mes).'
      });
    }

    const cerrado = await repo.estaCerrado({ filialId, periodo, anio, mes });
    if (cerrado) {
      const per = periodo || _periodoStr({ anio, mes });
      const accion = req.params?.id ? 'recalcular' : 'guardar';
      return res.status(409).json({
        ok: false,
        message: `No es posible ${accion}: el período ${per} ya está CERRADO para la filial ${filialId}.`
      });
    }

    if (_fromRow) {
      req._cierrePeriodoResueltoDesdeRow = true;
    }

    next();
  } catch (err) {
    console.error('bloqueoCierreQuinta error:', err);
    return res.status(500).json({ ok: false, message: 'Error validando cierre de quinta.' });
  }
};